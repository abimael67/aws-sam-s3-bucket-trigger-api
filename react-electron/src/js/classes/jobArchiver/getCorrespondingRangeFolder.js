import JOB_ARCHIVING_CONSTANTS from '../../constants/job-archiving'
import Logging from '../../utils/logging'
import File from '../../utils/file'
const aws = require('aws-sdk')
let config
try {
  config = JSON.parse(File.getContent(JOB_ARCHIVING_CONSTANTS.CONFIG_FILE))
}
catch (error) {
  Logging.logError("Error trying to initialize jobArchiver's config. Error:", error)
}

function removeNonFiles(originalFiles) {
  return originalFiles.slice().filter(file => !file.Key.endsWith("/"))
}

function getFolders(originalFiles) {
  return originalFiles.slice().filter(file => file.Key.endsWith("/"))
}

function getRangeFolders(commonPrefixes, prefix) {
  return commonPrefixes.slice()
    .map(element =>
      element.Prefix.substring(prefix.length - 1).replace('/', '')
    )
}

export default async function getCorrespondingRangeFolder(jobNumber) {
  const destinationBucket = JOB_ARCHIVING_CONSTANTS.DESTINATION_BUCKETS.archive_originals
  const bucket = destinationBucket
  const parentFolder = 'From Videographers/'
  const rangeFolders = (await getS3Content(bucket, parentFolder)).range
  for (const folder of rangeFolders) {
    const from = folder.substring(0, folder.indexOf('-'))
    const to = folder.substring(folder.indexOf('-') + 1, folder.length - 1)
    if (from && to && !isNaN(from) && !isNaN(to)) {
      if (jobNumber >= Number(from) && jobNumber <= Number(to)) {
        console.log('pass: ', jobNumber, 'from: ', from, 'to:', to)
        return {folder: folder.substring(0, folder.length - 1), create: false}
      }
    }
  }
  let folder = generateRangeFolderName(jobNumber)
  console.log('Generated: ', folder)
  return {folder, create: true}
}

function generateRangeFolderName(jobNumber) {
  const interval = 50000
  let from = Math.floor(jobNumber / interval) * interval;
  let to = from + (interval - 1)
  return `${from}-${to}`
}


async function getS3Content(
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

    let params = {
      Bucket: bucket,
      Prefix: parentFolder,
      Delimiter: '/'
    }

    const response = await s3.listObjectsV2(params).promise()

    Logging.log("getCorrespondingRangeFolder.getS3Content() response:", response)

    let files = removeNonFiles(response.Contents)
    let folders = getFolders(response.Contents)
    let range = getRangeFolders(response.CommonPrefixes, parentFolder)
    console.log('Folders3: ', folders)
    return { files, folders, range }
  }
  catch (error) {
    Logging.logError("ERROR inside getCorrespondingRangeFolder.getS3Content():", error)
    Logging.log("Error Printed separately:")
    Logging.log(error)
  }
}



