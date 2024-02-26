import React from 'react';
import { Form, Col } from 'react-bootstrap';

function LastName() {
    return (
      <Form.Group as={Col} className="textFieldLabel">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          placeholder="Enter last name" 
          className="textField"
          id="lastName"
          value={this.state.lastName}
          onChange={this.handleChange}
          maxLength='20'
        />
      </Form.Group>
    )
  } 

export default LastName;