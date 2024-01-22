import React from 'react'
import { Form, Col } from 'react-bootstrap'
import BlankfieldErrorDisplay from './../jobArchiving.logic/blankFieldErrorDisplay'
import Logging from './../../../utils/logging'

function FormErrors() {
  let errors = [];

  Logging.LogSectionStart("src.js.components.jobArchiving.jobArchiving.fields.formErrors.js FormErrors() about to display this.state")
  Logging.log("Inside FormErrors(). this.state:", this.state)
  Logging.LogSectionEnd()

  errors = errors
    .concat(BlankfieldErrorDisplay(this.state.errors.blankfield))
  ;
  let height='35px'

    return (
      <Form.Group as={Col}
        className="textFieldLabel errorsFormGroup"
        style={{
          paddingLeft:'0px',
          fontSize:'12px',
          marginBottom:'4px',
          minHeight:height,
        }}
      >
        {
          errors.map((error) => (
            <Form.Row key={error} style={{color:'red', marginTop:'0px', marginBottom:'1px'}}>
              <Form.Label style={{marginBottom:'0px'}}>{error}</Form.Label>
            </Form.Row>
          ))
        }
      </Form.Group>
    )
  
}

export default FormErrors;