import {mapStateToProps, logicConstructor } from './ArchivedJob.logic/ArchivedJob.logic'

import React, { Component } from 'react'
import { ListGroup, Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'

import './ArchivedJob.scss'
import fieldBind from './ArchivedJob.fields/ArchivedJob.fields'

import { ODD, EVEN, FAILURE } from './../../../constants/cssClassNames'
import { ARCHIVING_JOB,  SUCCESS, ERROR } from './../../../constants/job_archiving_statuses'
import JOB_ARCHIVING_CONSTANTS from '../../../constants/job-archiving'

const { SOURCE_BUCKETS, sourceToTargetBucketMappings, getDestinationParentDirectory } = JOB_ARCHIVING_CONSTANTS
function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
class ConnectedArchivedJob extends Component {
  constructor(props){
    super(props)
    
    logicConstructor.bind(this)(props)
    fieldBind.bind(this)()
  }

  render() {
    let oddOrEven = ODD

    if(this.props.jobOrdinalNumber%2 === 0){
      oddOrEven = EVEN
    }

    let successOrFailure = ''

    if(this.ArchivedJobObject.jobArchiver.jobArchivingStatus === ARCHIVING_JOB) {
      successOrFailure = ''
    }
    else if(this.ArchivedJobObject.jobArchiver.jobArchivingStatus === SUCCESS){
      successOrFailure = SUCCESS
    }
    else if(this.ArchivedJobObject.jobArchiver.jobArchivingStatus === ERROR){
      successOrFailure = FAILURE
    }

    let jobClasses = ''
    if(successOrFailure !== ''){
      jobClasses = successOrFailure + '_' + oddOrEven
    }

    let { jobArchiver } = this.ArchivedJobObject
    let {currentFile} = jobArchiver
   
   let currentFileName = currentFile && currentFile.Key.split('/').length > 0 ? currentFile.Key.split('/')[1] : "?"
   let currentFileSize = currentFile ? formatBytes(currentFile.Size) : "?"
    return (
      <ListGroup.Item
        style={{borderTopWidth:'1px',
          backgroundColor: this.selectBackgroundColor()}}
        className={
          'listItemGroupItem' 
          + ' ' + jobClasses
        }

        key={this.ArchivedJobObject.id}
      >
        <Row className="JobNumber">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Job Number:</u></Col>
          <Col style={{padingLeft:'10px'}}>{this.ArchivedJobObject.jobNumber}</Col>
        </Row>

        <Row className="JobNumber">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Source:</u></Col>
          <Col style={{padingLeft:'10px'}}>{jobArchiver.sourceBucket}/{this.ArchivedJobObject.jobNumber}</Col>
        </Row>

        <Row className="JobNumber">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Destination:</u></Col>
          <Col style={{padingLeft:'10px'}}>
            {sourceToTargetBucketMappings[jobArchiver.sourceBucket]}/{getDestinationParentDirectory(jobArchiver.sourceBucket, jobArchiver.year, jobArchiver.month, jobArchiver.rangeFolder)}{this.ArchivedJobObject.jobNumber}
          </Col>
        </Row>

        <Row className="TimeSubmitted">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Time Submitted:</u></Col>
          <Col style={{paddingLeft: '10px'}}>{jobArchiver.dateDisplay}</Col>
        </Row>
        <Row className="TimeSubmitted">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Current file:</u></Col>
          <Col style={{paddingLeft: '10px'}}>{currentFileName}</Col>
        </Row>
        <Row className="TimeSubmitted">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Current file size:</u></Col>
          <Col style={{paddingLeft: '10px'}}>{currentFileSize}</Col>
        </Row>
        <Row className="SubmissionResponse">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Submission Response:</u></Col>
          <Col style={{paddingLeft:'10px'}}>
            <Row style={{margin:'0 0'}}>{jobArchiver.jobArchivingStatus}</Row>
          </Col>
        </Row>

      </ListGroup.Item>
    )
  }
}

const ArchivedJob = connect(mapStateToProps)(ConnectedArchivedJob)

export default ArchivedJob