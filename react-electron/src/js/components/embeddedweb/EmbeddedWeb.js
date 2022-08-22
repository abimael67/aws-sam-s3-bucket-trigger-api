import React from 'react'
import { withRouter } from 'react-router-dom'
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
    view.setBounds({ x: 0, y: 70, width: 1000, height: 700 });

    view.webContents.loadURL("http://10.250.32.158:5000");

   
    return (
      <></>
    )
}

const EmbeddedWeb = withRouter(WithRouterEmbeddedWeb)

export default EmbeddedWeb
