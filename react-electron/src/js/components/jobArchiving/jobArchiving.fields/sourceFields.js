import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import JOB_ARCHIVING_CONSTANTS from '../../../constants/job-archiving'


function SourceFields() {
  const changeBucket = (bucketName) =>{
    this.setState({ sourceBucket: bucketName })
  }
  const { SOURCE_BUCKETS } = JOB_ARCHIVING_CONSTANTS

  return (
    <div style={{ width: '100%' }}>
      <Tabs defaultActiveKey="vxtprod" onSelect={changeBucket} activeKey={this.state.sourceBucket}>
        {
          Object.entries(SOURCE_BUCKETS).map(bucket =>
            <Tab style={{ width: '100%' }} key={bucket[0]} eventKey={bucket[0]} title={bucket[0]}>
              {this.JobNumberTextField()}
            </Tab>)
        }
      </Tabs>
    </div>
  )
}

export default SourceFields