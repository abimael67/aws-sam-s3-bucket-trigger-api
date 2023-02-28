import React from 'react';
import { Tabs, Tab, Form, Col } from 'react-bootstrap';
import JOB_ARCHIVING_CONSTANTS from '../../../constants/job-archiving'


function SourceFields() {
  const changeBucket = (bucketName) => {
    this.setState({ sourceBucket: bucketName })
  }
  const { SOURCE_BUCKETS } = JOB_ARCHIVING_CONSTANTS

  return (
    <div style={{ width: '100%' }}>
      <Tabs defaultActiveKey="vxtprod" onSelect={changeBucket} activeKey={this.state.sourceBucket}>
        {
          Object.entries(SOURCE_BUCKETS).map(bucket => {
            if (this.state.sourceBucket === "vxtzoom01")
              return (
                <Tab style={{ width: '100%' }} key={bucket[0]} eventKey={bucket[0]} title={bucket[0]}>
                  <Form.Row style={{maxHeight: '60px', marginBottom: '5px', borderWidth: '2px', borderColor: 'white' }}>

                  <Form.Group as={Col} className="textFieldLabel" style={{ padding: '0', paddingLeft: '1px', paddingRight: '1px', maxWidth: '8px' }}>
                   
                  </Form.Group>

                  {this.Year()}

                  <Form.Group as={Col} className="textFieldLabel" style={{ padding: '0', paddingLeft: '1px', paddingRight: '1px', maxWidth: '8px' }}>
                   
                  </Form.Group>

                  {this.Month()}

                  <Form.Group as={Col} className="textFieldLabel" style={{ padding: '0', paddingLeft: '1px', paddingRight: '1px', maxWidth: '8px' }}>
                  
                  </Form.Group>
                  </Form.Row>
                  {this.JobNumberTextField()}
                </Tab>
              )
            else
              return (
                <Tab style={{ width: '100%' }} key={bucket[0]} eventKey={bucket[0]} title={bucket[0]}>
                  {this.JobNumberTextField()}
                </Tab>)
          })
        }
      </Tabs>
    </div>
  )
}

export default SourceFields