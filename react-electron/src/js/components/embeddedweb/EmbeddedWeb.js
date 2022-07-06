import React from 'react'
import { withRouter } from 'react-router-dom'

function WithRouterEmbeddedWeb(props){
    console.log(props.history)
   
    return (
        <iframe id="webview" height={800} src="https://www.veritext.com" style={{__style:{height:700}}}></iframe>
    )
}

const EmbeddedWeb = withRouter(WithRouterEmbeddedWeb)
export default EmbeddedWeb