import { JOB_ARCHIVING_FINISHED, JOB_ARCHIVING_PROGRESS } from './../../constants/action-types'
import { action } from './../../utils/action'
import { SUCCESS, ERROR, ARCHIVING_JOB } from './../../constants/job_archiving_statuses'
import DateUtils from './../../utils/date-utils'
import Logging from './../../utils/logging'
import File from './../../utils/file'

import JOB_ARCHIVING_CONSTANTS from './../../constants/job-archiving'
import ENVS from './../../constants/environments'
import { formatBytes } from '../../components/archivedJobsList/ArchivedJob/ArchivedJob'
import { getObjectsToDelete } from './deleteFunctions'

const aws = require('aws-sdk')
var store = window.store

var config
try {
  config = JSON.parse(File.getContent(JOB_ARCHIVING_CONSTANTS.CONFIG_FILE))
}
catch (error) {
  Logging.logError("Error trying to initialize jobArchiver's config. Error:", error)
}

function calculateTransferProgress(allFiles, currentFile, currentProgress) {
  const totalSize = allFiles.reduce((acc, curr) => acc + curr.Size, 0)
  return currentProgress + (currentFile.Size / totalSize * 100)
}

class JobArchiver {
  constructor({
    sourceBucket,
    externalJobNumber,
    year,
    month,
    assignedUserEmail,
    contactName,
    contactEmail,
    contactPhone,
    id,
    //env = JOB_ARCHIVING_CONSTANTS.ENVS.TEST_ENV
    env = ENVS.DEV
  }) {
    this.sourceBucket = sourceBucket
    this.externalJobNumber = externalJobNumber
    this.year = year
    this.month = month
    this.assignedUserEmail = assignedUserEmail
    this.contactName = contactName
    this.contactEmail = contactEmail
    this.contactPhone = contactPhone
    this.id = id
    this.env = env
    this.dateDisplay = "<<Date & Time>>";
    this.jobArchivingStatus = ARCHIVING_JOB;
    this.errorMsgList = [];
    this.continuePolling = true
    this.currentFile = null;
    this.dateDisplay = DateUtils.GetDateDisplay()
    this.rangeFolder = ''
    this.movedFiles = []
  }

  removeNonFiles(originalFiles) {
    return originalFiles.slice().filter(file => !file.Key.endsWith("/"))
  }

  getFolders(originalFiles) {
    return originalFiles.slice().filter(file => file.Key.endsWith("/"))
  }

  getFoldersOnly(commonPrefixes, prefix) {
    return commonPrefixes.slice()
      .map(element =>
        element.Prefix.substring(prefix.length - 1).replace('/', '')
      )
  }

  async getCorrespondingRangeFolder() {
    const destinationBucket = JOB_ARCHIVING_CONSTANTS.DESTINATION_BUCKETS.archive_originals
    const { range, folders } = await this.getS3FileList(destinationBucket, 'From Videographers/')
    let jobNumber = this.externalJobNumber
    for (const folder of range) {
      const from = folder.substring(0, folder.indexOf('-'))
      const to = folder.substring(folder.indexOf('-') + 1, folder.length - 1)
      if (from && to && !isNaN(from) && !isNaN(to)) {
        if (jobNumber >= Number(from) && jobNumber <= Number(to)) {
          this.rangeFolder = folder.substring(0, folder.length - 1)
          return { folder: this.rangeFolder, create: false }
        }
      }
    }
    let folder = this.generateRangeFolderName(jobNumber)
    this.rangeFolder = folder
    return { folder, create: true }
  }
  generateRangeFolderName(jobNumber) {
    const interval = 50000
    let from = Math.floor(jobNumber / interval) * interval;
    let to = from + (interval - 1)
    return `${from}-${to}`
  }


  async deleteS3File(
    bucket,
    jobNumber,
    region = config.region,
    accessKeyId = config.accessKeyId,
    secretAccessKey = config.secretAccessKey,
    signatureVersion = 'v4'
  ) {
    try {
      const s3 = new aws.S3({
        endpoint: `s3.${config.region}.amazonaws.com`,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        Bucket: bucket,
        signatureVersion: signatureVersion,
        region: region
      })

      const objectsToDelete = getObjectsToDelete(this.movedFiles, jobNumber)
      const deleteParams = {
        Bucket: bucket,
        Delete: { Objects: [] }
      };

      deleteParams.Delete.Objects.push(...objectsToDelete.map(f => ({ Key: f })));
      Logging.log("Delete Params: ", deleteParams)
      await s3.deleteObjects(deleteParams).promise();

    }
    catch (error) {
      Logging.logError("ERROR inside jobArchiver.deleteS3File. error:", error)
    }
  }

  async getS3FileList(
    bucket,
    parentFolder,
    region = config.region,
    accessKeyId = config.accessKeyId,
    secretAccessKey = config.secretAccessKey,
    signatureVersion = 'v4'
  ) {
    try {
      const s3 = new aws.S3({
        endpoint: `s3.${config.region}.amazonaws.com`,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        Bucket: bucket,
        signatureVersion: signatureVersion,
        region: region
      })

      Logging.log("accessKeyId:", accessKeyId, "secretAccessKey:", secretAccessKey)
      let prefix = bucket === JOB_ARCHIVING_CONSTANTS.SOURCE_BUCKETS.vxtzoom01 ?
        `${this.year}/${this.month}/${parentFolder}` : parentFolder
      let params = {
        Bucket: bucket,
        Prefix: prefix,
      }
      const responseData = await s3.listObjectsV2(params).promise()
      const responseStructure = await s3.listObjectsV2({ ...params, Delimiter: '/' }).promise()
      Logging.log("jobArchiver.getS3Files() response:", responseData)
      Logging.log("jobArchiver.getS3Files() responseStructure:", responseStructure)
      let files = this.removeNonFiles(responseData.Contents)
      let folders = this.getFolders(responseData.Contents)
      let range = this.getFoldersOnly(responseStructure.CommonPrefixes, parentFolder)
      return { files, folders, range }
    }
    catch (error) {
      Logging.logError("ERROR inside JobArchiver.getFileList():", error)
      Logging.log("Error Printed separately:")
      Logging.log(error)
    }
  }


  async moveS3Files(
    sourceBucket,
    files,
    targetBucket,
    year,
    month,
    region = config.region,
    accessKeyId = config.accessKeyId,
    secretAccessKey = config.secretAccessKey,
    signatureVersion = 'v4'
  ) {
    try {
      const s3 = new aws.S3({
        endpoint: `s3.${config.region}.amazonaws.com`,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        Bucket: sourceBucket,
        signatureVersion: signatureVersion,
        region: region
      })
      let { folder } = await this.getCorrespondingRangeFolder()
      let rangeName = folder

      if (files.length && files.length > 0) {
        let iterator = 0
        let percentage = 0

        console.log("Move details. Source: ", sourceBucket, "Target: " + targetBucket, "Files: " + files)
        for (const file of files) {
          let splitFolderName = file.Key.split("/")
          let jobFolderAndFile = sourceBucket === JOB_ARCHIVING_CONSTANTS.SOURCE_BUCKETS.vxtzoom01 ?
            splitFolderName.splice(2, splitFolderName.length).join("/") : file.Key
          let fullDestRoute = `${JOB_ARCHIVING_CONSTANTS.getDestinationParentDirectory(sourceBucket, year, month, rangeName)}${jobFolderAndFile}`
          let params = {
            Bucket: targetBucket,
            CopySource: `${sourceBucket}/${file.Key}`,
            Key: fullDestRoute
          }

          this.currentFile = file

          s3.copyObject(params, (copyErr, copyData) => {
            if (copyErr) {
              Logging.logError("ERROR inside jobArchiver.moveS3Files during s3.copyObject. error:", copyErr)
            }
            else {
              iterator = iterator + 1
              Logging.info("Inside jobarchiver.moveS3Files during s3.copyObject. copyData:", copyData)
              file.copyData = copyData
              //set status
              percentage = calculateTransferProgress(files, file, percentage)
              let progress = {
                percentage: percentage,
                filename: file.Key.split('/')[1],
                fileSize: formatBytes(file.Size)
              }
              this.movedFiles.push(file)
              console.log("Copied files: ", this.movedFiles)
              this.jobArchivingStatus = `Success ${iterator} of ${files.length}`
              store.dispatch(action(JOB_ARCHIVING_PROGRESS, progress))
              store.dispatch(action(JOB_ARCHIVING_FINISHED, this.jobArchivingStatus))
              if (this.movedFiles.length === files.length)
                this.deleteS3File(sourceBucket, this.externalJobNumber, region, accessKeyId, secretAccessKey, signatureVersion)
            }
          })
        }
      }
      else {
        Logging.warn("Inside jobArchiver.moveS3Files(). files list was empty. files:", files)
        store.dispatch(action(JOB_ARCHIVING_FINISHED, `${ERROR} source folder empty or does not exist`))
      }
    }
    catch (error) {
      Logging.logError("error inside jobArchiver.moveS3Files:", error)
    }
  }

  async addObjectToS3(bucket,
    parentFolder,
    objectName,
    region = config.region,
    accessKeyId = config.accessKeyId,
    secretAccessKey = config.secretAccessKey,
    signatureVersion = 'v4') {

    try {
      const s3 = new aws.S3({
        endpoint: `s3.${config.region}.amazonaws.com`,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        Bucket: bucket,
        signatureVersion: signatureVersion,
        region: region
      })

      Logging.log("accessKeyId:", accessKeyId, "secretAccessKey:", secretAccessKey)

      let params = {
        Key: parentFolder + '/' + objectName
      }

      const response = await s3.putObject(params).promise()
      Logging.log("getCorrespondingRangeFolder.addObjectToS3() response:", response)

      return true
    }
    catch (error) {
      Logging.logError("ERROR inside getCorrespondingRangeFolder.addObjectToS3():", error)
      Logging.log("Error Printed separately:")
      Logging.log(error)
      return false
    }

  }

  async setStatus(files) {

    return SUCCESS
  }

  async archiveJob(sourceBucket = this.sourceBucket,
    externalJobNumber = this.externalJobNumber, year = this.year, month = this.month, env = this.env) {
    let newJobArchivingStatus = ""
    try {
      // GET LIST OF FILES TO BE MOVED
      let { files, folders } = await this.getS3FileList(sourceBucket, externalJobNumber)
      console.log("FILES AND FOLDERS: ", files, folders)
      //MOVE FILES
      await this.moveS3Files(
        sourceBucket,
        files,
        JOB_ARCHIVING_CONSTANTS.sourceToTargetBucketMappings[sourceBucket],
        //JOB_ARCHIVING_CONSTANTS[env].TARGET_BUCKET,
        year,
        month,
        config.region,
        config.accessKeyId,
        config.secretAccessKey,
        'v4'
      )

      //SET STATUS
      newJobArchivingStatus = await this.setStatus(files)
    }
    catch (e) {
      newJobArchivingStatus = ERROR
      this.errorMsgList = { error: e }
      Logging.log("ERROR in jobArchiver.archiveJob():", e)
    }
  }
}

export default JobArchiver






























