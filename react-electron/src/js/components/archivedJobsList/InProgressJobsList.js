import React, { Component, Fragment } from 'react'
import { Form, ListGroup, ProgressBar } from 'react-bootstrap'
import { connect } from 'react-redux'
import './ArchivedJobsList.scss'
import ArchivedJob from './ArchivedJob/ArchivedJob'
import { Scrollbars } from 'react-custom-scrollbars'
import getStatus from './ArchivedJob/ArchivedJob.logic/getStatus'
import { ARCHIVING_JOB } from '../../constants/job_archiving_statuses'

function mapStateToProps(state) {
  return {
    ...state,
    archivedJobs: state.archivedJobs
  }
}

class ConnectedInProgressJobsList extends Component {
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

    if (!Array.isArray(archivedJobs) || !archivedJobs.some(aj => getStatus(aj.jobArchiver.jobArchivingStatus) === ARCHIVING_JOB)) {
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
         No transfers currently in progress.
        </div>
      )
    }
    else {
      return null
    }
  }

  render() {
   
    let jobOrdinalNumber = 0
    return (
      <Fragment>
        <Form.Label className="textFieldLabel">In Progress Jobs</Form.Label>
        <Scrollbars className="scrollBars">
          <ListGroup className="submittedJobsListGroup">
            {this.placeholder(this.props.archivedJobs)}
            {
             this.props.archivedJobs.map(
                aj => {
                  jobOrdinalNumber++;
                  if(getStatus(aj.jobArchiver.jobArchivingStatus) === ARCHIVING_JOB )
                      return (<ArchivedJob key={aj.id} ArchivedJobObject={aj} jobOrdinalNumber={jobOrdinalNumber} />)
                }
              )
            }
            {
              this.props.archivingProgress.percentage > 0 &&  this.props.archivingProgress.percentage < 100 &&

              <ListGroup.Item>
                <ProgressBar animated
                  now={this.props.archivingProgress.percentage}
                  label={`${this.props.archivingProgress.percentage.toFixed(2)}%`}
                  variant={this.props.archivingProgress.percentage === 100 ? 'success' : 'info'}
                />
              </ListGroup.Item>
            }
          </ListGroup>
        </Scrollbars>
      </Fragment>
    )
   
  }
}

const InProgressJobsList = connect(mapStateToProps)(ConnectedInProgressJobsList)

export default InProgressJobsList