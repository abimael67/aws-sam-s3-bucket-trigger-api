import React from 'react'
import { Form, Col } from 'react-bootstrap';
export default function JobNumberTextField() {
    return (
        <Form.Group as={Col} className="textFieldLabel" style={{ minWidth: '80px' }}>
            <Form.Label>Job Number</Form.Label>
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
    )
}