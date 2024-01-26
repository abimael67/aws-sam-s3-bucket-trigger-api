import React from 'react';
import { Form, Col } from 'react-bootstrap';

function FirstName() {
    return (
      <Form.Group as={Col} className="textFieldLabel">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          placeholder="Enter first name" 
          className="textField"
          id="firstName"
          value={this.state.firstName}
          onChange={this.handleChange}
          maxLength='8'
        />
      </Form.Group>
    )
  } 

export default FirstName;