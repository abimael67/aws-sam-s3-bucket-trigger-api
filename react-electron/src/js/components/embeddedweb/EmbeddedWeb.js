import React from 'react'
import { withRouter } from 'react-router-dom'
import SectionTitle from '../../utils/sectionTitle';
import { Form, Col } from 'react-bootstrap'
var electron = window.require("electron")

function WithRouterEmbeddedWeb(props) {
    let window = electron.remote.getCurrentWindow();
    let view = new electron.remote.BrowserView(
        {
            webPreferences: {
                nodeIntegration: false
            }
        }
    )
    window.setBrowserView(view);
    view.setAutoResize({ width: true, height: true });
    view.setBounds({ x: 0, y: 115, width: window.getBounds().width, height: window.getBounds().height - 190 });
      
    view.webContents.loadURL("http://10.250.32.158:5000");
    view.webContents.on('did-finish-load', () => {
        view.webContents.insertCSS('.v-app-bar {display: none !important; }')
        view.webContents.insertCSS('.v-main {padding: 0 !important; }')
        view.webContents.insertCSS('.v-application {background-color: #282c34 !important; }')
    })

    return (
        <div style={{textAlign:"left !important"}} className="main">
            <Col>{SectionTitle('Media Clipping')}</Col>
        </div >
    )
}

const EmbeddedWeb = withRouter(WithRouterEmbeddedWeb)

export default EmbeddedWeb
