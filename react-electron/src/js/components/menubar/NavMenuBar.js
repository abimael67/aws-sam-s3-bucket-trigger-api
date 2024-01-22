import React from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import './NavMenuBar.scss'

const { BrowserWindow } = window.require('@electron/remote')
var remote = BrowserWindow;
const WithRouterNavMenuBar = props =>{
    const SYNCING = 'Sync'
    const SYNCING_ROUTE = '/app'
    const JOB_ARCHIVING = 'Archive'
    const JOB_ARCHIVING_ROUTE = '/jobarchiving'
    const FILE_STITCHING = 'Stitch' 
    const FILE_STITCHING_ROUTE = '/filestitching'
    const MPEG_CONVERSION = 'Convert'
    const MPEG_CONVERSION_ROUTE = '/mpegconversion'
    const LOCAL_DOWNLOAD = 'Download'
    const LOCAL_DOWNLOAD_ROUTE = '/localdownload'
    const GLIM = 'Clip'
    const GLIM_ROUTE = '/embeddedweb'
    
    let dropdownRouteMappings = {}
    dropdownRouteMappings[SYNCING] = SYNCING_ROUTE
    dropdownRouteMappings[JOB_ARCHIVING] = JOB_ARCHIVING_ROUTE
    dropdownRouteMappings[FILE_STITCHING] = FILE_STITCHING_ROUTE
    dropdownRouteMappings[MPEG_CONVERSION] = MPEG_CONVERSION_ROUTE
    dropdownRouteMappings[GLIM] = GLIM_ROUTE
    dropdownRouteMappings[LOCAL_DOWNLOAD] = LOCAL_DOWNLOAD_ROUTE
  
    const handleClick = (route) => {
        let window = remote.getFocusedWindow()
        window.setBrowserView(null)
        props.history.push(route)
    }
    return (
        <Row className='subtitle-bar'>
            {Object.entries(dropdownRouteMappings).map(r => 
            <Col key={r[0]} md="auto">  
                <Button
                    onClick={() => handleClick(r[1])}
                    variant="link"
                    className={props.location.pathname === r[1] ? "subtitle-bar-button selected" : "subtitle-bar-button"}>
                <span className='subtitle-button-text'>{r[0]}</span>
                </Button>
            </Col>)}
        </Row>
    )
}

const NavMenuBar = withRouter(WithRouterNavMenuBar)

export default NavMenuBar