import React from 'react'
import { Form, Col } from 'react-bootstrap';
export default function JobNumberTextField() {
    return (
        <Form.Group as={Col} className="textFieldLabel"
            style={{ borderWidth: '1px', borderColor: 'white', borderStyle: 'solid', padding: '10px', width:'100%', minHeight:'230px' }}
        >
            {/* <div
                className='boxedGroupLabel'
                style={{ marginBottom: '10px', width: '100%', paddingLeft: '2px' }}>From</div> */}

            <Form.Row>
               
                <Form.Group as={Col} className="textFieldLabel" style={{ padding: '0', paddingLeft: '1px', paddingRight: '1px', maxWidth: '8px' }}>
                    <Form.Label style={{ paddingTop: '43px', color: 'darkgrey' }}></Form.Label>
                </Form.Group>

                <Form.Group as={Col} className="textFieldLabel" style={{ minWidth: '80px' }}>

                    <Form.Row style={{marginTop:'15px', maxHeight: '35px', marginBottom: '5px', borderWidth: '2px', borderColor: 'white' }}>
                        <Col>
                            <Form.Label>Job Number</Form.Label>
                        </Col>
                        {/* <Col className="browseButtonCol">
                            {this.BrowseButton()}
                        </Col> */}

                    </Form.Row>
                    <Form.Control
                        placeholder="Enter Job Number"
                        className="textField"
                        id="jobNumber"
                        value={this.state.jobNumber}
                        onKeyPress={
                            event => { this.handleJobNumberPressEnterKey(event) }
                        }
                        onChange={this.handleChange}
                        maxLength='8'
                    />
                </Form.Group>
            </Form.Row>
            <Form.Row style={{marginTop:'15px', maxHeight: '35px', marginBottom: '5px', borderWidth: '2px', borderColor: 'white' }}>
                 
            {this.DestinationFields()}
            </Form.Row>
        </Form.Group>
    )
}