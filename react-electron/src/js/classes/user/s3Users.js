import JOB_ARCHIVING_CONSTANTS from './../../constants/job-archiving'
import File from './../../utils/file'
const aws = require('aws-sdk')
const getJsonFromS3 = async () => {
    let config
    try {
        config = JSON
            .parse(File.getContent(JOB_ARCHIVING_CONSTANTS.CONFIG_FILE))

    } catch (error) {
        console.log("Error accessing the config file: ", error)
    }

    const s3 = new aws.S3({
        endpoint: `s3.${config.region}.amazonaws.com`,
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        Bucket: JOB_ARCHIVING_CONSTANTS.SOURCE_BUCKETS.vxtprod,
        signatureVersion: 'v4',
        region: config.region
    })

    const s3Output = await s3.getObject({
        Key: "users/users.json",
        Bucket: JOB_ARCHIVING_CONSTANTS.SOURCE_BUCKETS.vxtprod
    }).promise()
    console.log("s3 file: ", s3Output)
    try {
        const jsonString = s3Output.Body?.toString("utf-8")
        const json = JSON.parse(jsonString ?? '')
        return json
    } catch (error) {
        console.error('error parsing json', error)
        return null
    }
}

export default getJsonFromS3