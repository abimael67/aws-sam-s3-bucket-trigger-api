import React, { Component, Fragment } from 'react'
import { Form, ListGroup, ProgressBar } from 'react-bootstrap'
import { connect } from 'react-redux'
import './ArchivedJobsList.scss'
import ArchivedJob from './ArchivedJob/ArchivedJob'
import { Scrollbars } from 'react-custom-scrollbars'
import getStatus from './ArchivedJob/ArchivedJob.logic/getStatus'
import { SUCCESS, ERROR, ARCHIVING_JOB } from '../../constants/job_archiving_statuses'
function mapStateToProps(state) {
  return {
    ...state,
    archivedJobs: state.archivedJobs
  }
}

class ConnectedArchivedJobsList extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    this.dispatch = dispatch
  }

  constructor(props) {
    super(props)
    this.archivedJobs = props.archivedJobs
    //^^//console.log("props.archivedJobs:")
    //^^//console.log(props.archivedJobs)
    this.render = this.render.bind(this)
    this.placeholder = this.placeholder.bind(this)
  }

  placeholder(archivedJobs) {

    if (!Array.isArray(archivedJobs) || archivedJobs.length < 1) {
      let paddingSides = '10px'
      let paddingTop = paddingSides

      return (
        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: 'darkgrey',
            borderRadius: '.25rem',
            backgroundColor: 'none',
            height: '110px',
            paddingLeft: paddingSides,
            paddingRight: paddingSides,
            paddingTop: paddingTop,
            width: '100%',
            color: 'darkgrey',
            fontSize: '14px'
          }}
        >
          Archive a Job by Clicking the 'Archive Job' Button
        </div>
      )
    }
    else {
      return null
    }
  }

  render() {
    //^^//console.log("rendering archived jobs list group...")
    
    let jobOrdinalNumber = 0
      return (
        <Fragment>
          <Form.Label className="textFieldLabel">Completed Jobs</Form.Label>
          <Form.Label className="textFieldLabel"></Form.Label>
          <Scrollbars className="scrollBars">
            <ListGroup className="submittedJobsListGroup">
              {this.placeholder(this.props.archivedJobs)}
              {
                this.props.archivedJobs.map(
                  aj => {
                    jobOrdinalNumber++;
                    if(getStatus(aj.jobArchiver.jobArchivingStatus) === SUCCESS ||
                    getStatus(aj.jobArchiver.jobArchivingStatus) === ERROR)
                    return (<ArchivedJob key={aj.id} ArchivedJobObject={aj} jobOrdinalNumber={jobOrdinalNumber} completed />)
                  }
                )
              }

            </ListGroup>
          </Scrollbars>
        </Fragment>
      )
     
  }
}

const ArchivedJobsList = connect(mapStateToProps)(ConnectedArchivedJobsList)

export default ArchivedJobsList