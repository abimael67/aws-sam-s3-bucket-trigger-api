import { JOB_ARCHIVING_FINISHED, JOB_ARCHIVING_PROGRESS } from './../../constants/action-types'
import { action } from './../../utils/action'
import { SUCCESS, ERROR, ARCHIVING_JOB } from './../../constants/job_archiving_statuses'
import DateUtils from './../../utils/date-utils'
import Logging from './../../utils/logging'
import File from './../../utils/file'
import defined from './../../utils/defined'
import JOB_ARCHIVING_CONSTANTS from './../../constants/job-archiving'
import ENVS from './../../constants/environments'
import { formatBytes } from '../../components/archivedJobsList/ArchivedJob/ArchivedJob'

const aws = require('aws-sdk')
const ASYNC = require('async')
var store = window.store

var config
try {
  config = JSON.parse(File.getContent(JOB_ARCHIVING_CONSTANTS.CONFIG_FILE))
}
catch (error) {
  Logging.logError("Error trying to initialize jobArchiver's config. Error:", error)
}

function getParentFolder(fileKey) {
  if (fileKey[fileKey.length - 1] === "/") {
    fileKey = fileKey.slice(0, -1)
  }

  let result = `${fileKey.substr(0, fileKey.lastIndexOf('/'))}/`

  return result
}

function calculateTransferProgress(allFiles, currentFile, currentProgress){
  const totalFiles = allFiles.length;
  const totalSize = allFiles.reduce((acc, curr)=> acc + curr.Size, 0)
  return currentProgress + (currentFile.Size / totalSize * 100)
}

async function deleteParentFolderIfEmpty(
  bucket,
  file,
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

    let parentFolder = getParentFolder(file.Key)
    const params = {
      Bucket: bucket,
      Prefix: parentFolder
    }

    s3.listObjectsV2(params, function (err, data) {
      if (err) {
        Logging.logError("error inside jobArchiver.deleteParentFolderIfEmpty during s3.deleteObject. error:", err)
      }
      else {
        Logging.info("Inside jobArchiver.deleteS3File during s3.deleteObject. copyData:", data)

        if (defined(data, "Contents.length") && data.Contents.length === 1) {
          deleteS3File(bucket, parentFolder, region, accessKeyId, secretAccessKey, signatureVersion, true)
        }

      }
    })
  }
  catch (error) {
    Logging.logError("ERROR inside jobArchiver.deleteS3File. error:", error)
  }
}

async function deleteS3File(
  bucket,
  file,
  region = config.region,
  accessKeyId = config.accessKeyId,
  secretAccessKey = config.secretAccessKey,
  signatureVersion = 'v4',
  isFolder = false
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

    const params = {
      Bucket: bucket,
      Key: isFolder ? file : file.Key
    }

    s3.deleteObject(params, function (err, deleteData) {
      if (err) {
        Logging.logError("error inside jobArchiver.deleteS3File during s3.deleteObject. error:", err)
      }
      else {
        Logging.info("Inside jobarchiver.deleteS3File during s3.deleteObject. copyData:", deleteData)
        //file.deleteData = deleteData

        deleteParentFolderIfEmpty(bucket, file, region, accessKeyId, secretAccessKey, signatureVersion)
      }
    })
  }
  catch (error) {
    Logging.logError("ERROR inside jobArchiver.deleteS3File. error:", error)
  }
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
    try {
    //  this.archiveJob(this.sourceBucket, this.externalJobNumber, this.year, this.month, this.env)
    }
    catch (e) {
      Logging.logError("ERROR in constructor method of JobArchiver. Error:", e)
    }
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
          return {folder: this.rangeFolder, create: false}
        }
      }
    }
    let folder = this.generateRangeFolderName(jobNumber)
    this.rangeFolder = folder
    return {folder, create: true}
  }
  generateRangeFolderName(jobNumber) {
    const interval = 50000
    let from = Math.floor(jobNumber / interval) * interval;
    let to = from + (interval - 1)
    return `${from}-${to}`
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
      console.log("Get file list Params: ", params)
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
    //targetParentFolder,
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
      let {folder} = await this.getCorrespondingRangeFolder()
      let rangeName = folder
    
      if (files.length && files.length > 0) {
        let iterator = 0
        let percentage = 0
       
      
        ASYNC.each(files, (file, cb) => {
          let splitFolderName = file.Key.split("/")
          let jobFolderAndFile = sourceBucket === JOB_ARCHIVING_CONSTANTS.SOURCE_BUCKETS.vxtzoom01 ?
          `${splitFolderName[splitFolderName.length -2]}/${splitFolderName[splitFolderName.length -1]}` : file.Key
          let params = {
            Bucket: targetBucket,
            CopySource: `/${sourceBucket}/${file.Key}`,
            //Key: `${year}/${month}/${file.Key}`
            Key: `${JOB_ARCHIVING_CONSTANTS.getDestinationParentDirectory(sourceBucket, year, month, rangeName)}${jobFolderAndFile}`
          }
         
         
          this.currentFile = file
          //get size prop from file
        
          s3.copyObject(params, (copyErr, copyData) => {
            if (copyErr) {
              Logging.logError("ERROR inside jobArchiver.moveS3Files during s3.copyObject. error:", copyErr)
            }
            else {
              iterator = iterator + 1
              Logging.info("Inside jobarchiver.moveS3Files during s3.copyObject. copyData:", copyData)
              cb()
              file.copyData = copyData
              //set status
              percentage = calculateTransferProgress(files, file, percentage)
              let progress = {
                percentage : percentage,
                filename: file.Key.split('/')[1],
                fileSize: formatBytes(file.Size)
              }
              this.jobArchivingStatus = `Success ${iterator} of ${files.length}`
              store.dispatch(action(JOB_ARCHIVING_PROGRESS, progress))
              store.dispatch(action(JOB_ARCHIVING_FINISHED, this.jobArchivingStatus))
              deleteS3File(sourceBucket, file, region, accessKeyId, secretAccessKey, signatureVersion)
            }
          })
        })
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
      console.log('Added object!')
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

  async deleteFolders(
    sourceBucket,
    files,
    targetBucket,
    //targetParentFolder,
    folders,
    year,
    month,
    region = config.region,
    accessKeyId = config.accessKeyId,
    secretAccessKey = config.secretAccessKey,
    signatureVersion = 'v4'
  ) {
    Logging.LogSectionStart("jobArchiver.deleteFolders")
    Logging.log("jobArchiver.deleteFolders.folders:", folders)
    Logging.log("jobArchiver.deleteFolders.files:", files)
    Logging.LogSectionEnd("jobArchiver.deleteFolders")

    try {
      const s3 = new aws.S3({
        endpoint: `s3.${config.region}.amazonaws.com`,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        Bucket: sourceBucket,
        signatureVersion: signatureVersion,
        region: region
      })

      if (folders.length && folders.length > 0) {

      }

      this.ShouldWeContinuePolling()
    }
    catch (error) {
      Logging.logError("error inside jobArchiver.deleteFolders:", error)
    }
  }

  ShouldWeContinuePolling() {
    if (!this.continuePolling) {
      clearInterval(this.IdOfTimerToPollForWhetherEmptyFoldersHaveBeenDeleted)
    }
  }

  PollForWhetherEmptyFoldersHaveBeenDeleted(
    sourceBucket,
    files,
    targetBucket,
    //targetParentFolder,
    folders,
    year,
    month,
    region = config.region,
    accessKeyId = config.accessKeyId,
    secretAccessKey = config.secretAccessKey,
    signatureVersion = 'v4'
  ) {
    let timeoutTimeInMilliseconds = 60 * 1000

    this.IdOfTimerToPollForWhetherEmptyFoldersHaveBeenDeleted = setInterval(
      (() => {
        this.deleteFolders(
          sourceBucket,
          files,
          JOB_ARCHIVING_CONSTANTS.sourceToTargetBucketMappings[sourceBucket],
          //JOB_ARCHIVING_CONSTANTS[env].TARGET_BUCKET,
          folders,
          year,
          month,
          config.region,
          config.accessKeyId,
          config.secretAccessKey,
          'v4'
        )
      }
      ),
      timeoutTimeInMilliseconds
    )
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

      this.PollForWhetherEmptyFoldersHaveBeenDeleted(
        sourceBucket,
        files,
        JOB_ARCHIVING_CONSTANTS.sourceToTargetBucketMappings[sourceBucket],
        //JOB_ARCHIVING_CONSTANTS[env].TARGET_BUCKET,
        folders,
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
      //^^//console.log(`Error archiving job. Error: ${e}`)
      this.errorMsgList = { error: e }
      Logging.log("ERROR in jobArchiver.archiveJob():", e)
    }
    // this.jobArchivingStatus = newJobArchivingStatus

   // store.dispatch(action(JOB_ARCHIVING_FINISHED, newJobArchivingStatus))
  }
}

export default JobArchiver






























