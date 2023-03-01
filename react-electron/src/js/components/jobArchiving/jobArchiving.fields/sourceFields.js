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
                 
                  <Form.Group as={Col} className="textFieldLabel"
                    style={{ borderWidth: '1px', borderColor: 'white', borderStyle: 'solid', padding: '10px', width: '100%', minHeight: '230px' }}
                  >
                    <Form.Row>
                      <Form.Group as={Col} className="textFieldLabel" style={{ padding: '0', paddingLeft: '1px', paddingRight: '1px', maxWidth: '8px' }}>
                        <Form.Label style={{ paddingTop: '43px', color: 'darkgrey' }}></Form.Label>
                      </Form.Group>
                      {this.Year()}
                      {this.Month()}
                      {this.JobNumberTextField()}

                    </Form.Row>
                    <Form.Row style={{ marginTop: '15px', maxHeight: '35px', marginBottom: '5px', borderWidth: '2px', borderColor: 'white' }}>
                      {this.DestinationFields()}
                    </Form.Row>
                  </Form.Group>

                </Tab>
              )
            else
              return (
                <Tab style={{ width: '100%' }} key={bucket[0]} eventKey={bucket[0]} title={bucket[0]}>
                  

                  <Form.Group as={Col} className="textFieldLabel"
                    style={{ borderWidth: '1px', borderColor: 'white', borderStyle: 'solid', padding: '10px', width: '100%', minHeight: '230px' }}
                  >
                    <Form.Row>
                      <Form.Group as={Col} className="textFieldLabel" style={{ padding: '0', paddingLeft: '1px', paddingRight: '1px', maxWidth: '8px' }}>
                        <Form.Label style={{ paddingTop: '43px', color: 'darkgrey' }}></Form.Label>
                      </Form.Group>
                    
                      {this.JobNumberTextField()}

                    </Form.Row>
                    <Form.Row style={{ marginTop: '15px', maxHeight: '35px', marginBottom: '5px', borderWidth: '2px', borderColor: 'white' }}>
                      {this.DestinationFields()}
                    </Form.Row>
                  </Form.Group>
                </Tab>)
          })
        }
      </Tabs>
    </div>
  )
}

export default SourceFields