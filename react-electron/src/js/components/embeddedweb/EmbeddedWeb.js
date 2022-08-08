import React from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Row, Col } from 'react-bootstrap'
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

    const SYNCING = 'Sync'
    const SYNCING_ROUTE = '/app'
    const JOB_ARCHIVING = 'Store'
    const JOB_ARCHIVING_ROUTE = '/jobarchiving'
    const FILE_STITCHING = 'Stitch' 
    const FILE_STITCHING_ROUTE = '/filestitching'
    const MPEG_CONVERSION = 'MPEG Conversion'
    const MPEG_CONVERSION_ROUTE = '/mpegconversion'
    const LOCAL_DOWNLOAD = 'Local Download'
    const LOCAL_DOWNLOAD_ROUTE = '/localdownload'
    
    let dropdownRouteMappings = {}
    dropdownRouteMappings[SYNCING] = SYNCING_ROUTE
    dropdownRouteMappings[JOB_ARCHIVING] = JOB_ARCHIVING_ROUTE
    dropdownRouteMappings[FILE_STITCHING] = FILE_STITCHING_ROUTE
    dropdownRouteMappings[MPEG_CONVERSION] = MPEG_CONVERSION_ROUTE
    dropdownRouteMappings[LOCAL_DOWNLOAD] = LOCAL_DOWNLOAD_ROUTE
  
    function handleClick(route) {
        window.setBrowserView(null)
        props.history.push(route);
      }
    return (
        <><Row className='subtitle-bar'>
            {Object.entries(dropdownRouteMappings).map(r => 
            <Col key={r[0]} md="auto">  
                <Button
                    onClick={() => handleClick(r[1])}
                    variant="info"
                    className="subtitle-bar-button">
                <span className='subtitle-button-text'>{r[0]}</span>
                </Button>
            </Col>)}
        </Row></>
    )
}

const EmbeddedWeb = withRouter(WithRouterEmbeddedWeb)

export default EmbeddedWeb
