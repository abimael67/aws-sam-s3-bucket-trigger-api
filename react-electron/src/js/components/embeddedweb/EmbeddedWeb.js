import React from 'react'

import { withRouter } from 'react-router-dom'
import SectionTitle from '../../utils/sectionTitle';
import { Form, Col } from 'react-bootstrap'
//const { BrowserView } = window.require( 'electron')
const { BrowserWindow, BrowserView } = window.require('@electron/remote')
function WithRouterEmbeddedWeb(props) {
    let currentWindow = BrowserWindow.fromId(1);
    console.log("CURR: ",currentWindow)
    const view = new BrowserView()
    //     {
    //         webPreferences: {
    //             nodeIntegration: false
    //         }
    //     }
    // )
    currentWindow.setBrowserView(view);
    view.setAutoResize({ width: true, height: true });
    view.setBounds({ x: 0, y: 120, width: currentWindow.getBounds().width, height: currentWindow.getBounds().height - 190 });
      
    view.webContents.loadURL("http://10.250.32.158:5000");
    view.webContents.on('did-finish-load', () => {
        view.webContents.insertCSS('.v-app-bar {display: none !important; }')
        view.webContents.insertCSS('.v-main {padding: 0 !important; }')
        view.webContents.insertCSS('.v-application {background-color: #282c34 !important; }')
    })

    return (
        <div style={{textAlign:"left !important", marginBottom: "20px"}} className="main">
            <Col>{SectionTitle('Media Clipping')}</Col>
        </div >
    )
}

const EmbeddedWeb = withRouter(WithRouterEmbeddedWeb)

export default EmbeddedWeb
