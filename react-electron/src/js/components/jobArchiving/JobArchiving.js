import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Form, Col } from 'react-bootstrap';
import fieldBind from './jobArchiving.fields';
import {mapDispatchToProps, logicConstructor } from './jobArchiving.logic/JobArchiving.logic'
import SectionTitle from './../../utils/sectionTitle'
import ArchivedJobsList from '../archivedJobsList/ArchivedJobsList'
import './JobArchiving.scss'
import JOB_ARCHIVING_CONSTANTS from './../../constants/job-archiving'
import InProgressJobsList from '../archivedJobsList/InProgressJobsList';

class ConnectedJobArchiving extends Component {
  constructor(props) {
    super(props);
    logicConstructor.bind(this)(props);
    fieldBind.bind(this)();
  }

  render() {

    console.log("JobArchiving. sourceBuckets:")
    console.log(JOB_ARCHIVING_CONSTANTS.SOURCE_BUCKETS)
    console.log("JobArchiving. sourceToTargetBucketMappings:")
    console.log(JOB_ARCHIVING_CONSTANTS.sourceToTargetBucketMappings)
    
    return (
      <div style={{height:'100%'}} className="main">
      <Form
        style={{
          height:'100%',
          display:'flex',
          flexDirection:'column',
        }} 
        className="form" onSubmit={this.handleSubmit}>
        <Form.Row style={{height:'100%'}}>
          <Col xs={7} style={{paddingBottom:'20px', display:'flex', flexDirection:'column'}}>
            <Form.Row style={{maxHeight:'35px'}}>{ SectionTitle('Media Archiving' ) }</Form.Row>
            <Form.Row style={{marginTop:'20px'}}>{ this.SourceFields() }</Form.Row>
            <Form.Row style={{marginTop:'15px'}}> <InProgressJobsList /></Form.Row>
            <Form.Row style={{maxHeight:'20px'}}>{ this.FormErrors() }</Form.Row>
            <Form.Row style={{maxHeight:'35px'}}>{ this.ArchiveJobButton() }</Form.Row>
          </Col>
          
          <Col xs={5} className="submittedJobsCol">
            <ArchivedJobsList />
          </Col> 
        </Form.Row>
      </Form>
      </div>
    )
  }
}

const JobArchiving = connect(null, mapDispatchToProps)(ConnectedJobArchiving);
export default JobArchiving;