import defined from './defined'

function isDevFunc() {
   const nodeEnv = process.env.NODE_ENV
   console.log("nodeEnv: ", nodeEnv)
  // console.log(nodeEnv)
   let result = false
  // return result

  // console.log("nodeEnv:")
  // console.log(nodeEnv)

  if( !nodeEnv || (defined(nodeEnv) && nodeEnv === 'development') ) {
    result = true
  }

  console.log("isDev:")
  console.log(result)

  return result
}

const isDev = isDevFunc()

export default isDev