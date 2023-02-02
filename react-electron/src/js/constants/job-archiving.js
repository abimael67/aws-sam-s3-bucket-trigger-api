import STRING_CONSTANTS from './string'
import ENVS from './environments'
import getEnv from './../utils/get-env'
import isDev from '../utils/is-dev'
const SOURCE_BUCKETS = {
  vxtprod:  "vxtprod",
  videoin01: isDev ? "vxttest003" : "videoin01",
  vxtzoom01: "vxtzoom01"
}
const DESTINATION_BUCKETS = {
  vxtarcOrVxttest004: (getEnv() === ENVS.PROD ? "vxtarc" : "vxttest004"),
  archive_originals: isDev ? "vxttest004" : "archive_originals"
}

const sourceToTargetBucketMappings = {
  [SOURCE_BUCKETS.vxtprod]: DESTINATION_BUCKETS.vxtarcOrVxttest004,
  [SOURCE_BUCKETS.videoin01]: DESTINATION_BUCKETS.archive_originals,
  [SOURCE_BUCKETS.vxtzoom01]: DESTINATION_BUCKETS.archive_originals
}



function getDestinationParentDirectory(sourceBucket, year, month, range) {
  let result = ""
  if(sourceBucket === SOURCE_BUCKETS.vxtprod) {
    result = `${year}/${month}/`
  }
  else if(sourceBucket === SOURCE_BUCKETS.videoin01) {
    result = `From Videographers/${range || ''}/`
  }
  else if(sourceBucket === SOURCE_BUCKETS.vxtzoom01) {
    result = `zoom/${year}/${month}/`
  }
  else {
    throw Error('ERROR: getDestinationParentDirectory(): invalid sourceBucket value')
  }

  return result
}
const JOB_ARCHIVING_CONSTANTS = {
  CONFIG_FILE: `${STRING_CONSTANTS.USER_DATA_FOLDER}\\private\\MPEG1_CONVERSION_CONFIG.json`,
  SOURCE_BUCKETS,
  DEFAULT_SOURCE_BUCKET: SOURCE_BUCKETS.vxtprod,
  //SOURCE_BUCKET: "vxtprod",
  //TARGET_BUCKET: "vxtarc",
  sourceToTargetBucketMappings,
  getDestinationParentDirectory,
  DESTINATION_BUCKETS,
  /*
  ENVS: {
    TEST_ENV: "TEST_ENV",
    PROD_ENV: "PROD_ENV"
  },
  TEST_ENV: {
    SOURCE_BUCKET: "vxttest003",
    TARGET_BUCKET: "vxttest004"
  },
  PROD_ENV: {
    SOURCE_BUCKET: "vxtprod",
    TARGET_BUCKET: "vxtarc"
  }
  */
}

export default JOB_ARCHIVING_CONSTANTS