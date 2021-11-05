import STRING_CONSTANTS from './string'

const FACTORY_ID = "ta0106ec3b72875ea6da40a8a0387061" // OLD FACTORY ID
//const FACTORY_ID = "82e71972c8815fe95ef85a3fcb003179" //NEW FACTORY ID THAT WAS TAKEN OFFLINE
const TIMEOUT_IN_SECONDS = 10

const MPEG_CONVERSION_CONSTANTS = {
  FACTORY_ID: FACTORY_ID,
  TEMPLATE_ID: "ada7718a715c6adb21e86935017c8ccc",
  DATE_DISPLAY_DEFAULT: "<<Date & Time>>",
  SF_API_KEY_FILE: `${STRING_CONSTANTS.USER_DATA_FOLDER}\\private\\SF_API_KEY.txt`,
  //SF_API_KEY_FILE: `${STRING_CONSTANTS.USER_DATA_FOLDER}\\private\\SF_API_KEY_TESTING.txt`,
  CONFIG_FILE: `${STRING_CONSTANTS.USER_DATA_FOLDER}\\private\\MPEG1_CONVERSION_CONFIG.json`, 
  CREATE_TELESTREAM_JOB_API: {
    //URL:`https://api.cloud.telestream.net/transform/v1.0/factories/${FACTORY_ID}/jobs`,
    URL: `https://api.cloud.telestream.net/flip/3.1/videos.json?factory_id=${FACTORY_ID}`,
    //URL: `https://8071518d-4ff8-4328-8aec-9b95c45e70df.mock.pstmn.io/flip/3.1/videos.json?factory_id=${FACTORY_ID}`,
    METHOD: 'post',
    HEADER_NAMES: {
      X_API_KEY: 'X-Api-Key'
    }
  },
  GET_TELESTREAM_JOB_STATUS_UPDATE_API: {
    //URL_BASE: `https://api.cloud.telestream.net/transform/v1.0/factories/${FACTORY_ID}/jobs/`,
    URL_BASE: `https://api.cloud.telestream.net/flip/3.1/encodings.json?factory_id=${FACTORY_ID}&video_id=`,
    //URL_BASE: `https://8071518d-4ff8-4328-8aec-9b95c45e70df.mock.pstmn.io/flip/3.1/encodings.json?factory_id=${FACTORY_ID}&video_id=`,
    METHOD: 'get',
    HEADER_NAMES: {
      X_API_KEY: 'X-Api-Key'
    },
    MAX_FAILED_ATTEMPTS: 3
  },
  POLLING: {
    TIMEOUT_IN_SECONDS: TIMEOUT_IN_SECONDS,
    TIMEOUT_IN_MILLISECONDS: TIMEOUT_IN_SECONDS * 1000
  }
}

export default MPEG_CONVERSION_CONSTANTS