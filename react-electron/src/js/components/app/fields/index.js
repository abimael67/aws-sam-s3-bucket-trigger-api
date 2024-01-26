import JobNumber from './jobNumber'
import SourceFiles from './sourceFiles'
import OrderType from './orderType'
import Priority from './priority'
import Notes from './notes'
import SubmitJobButton from './submitJobButton'
import FirstName from './firstName'
import LastName from './lastName'

function fieldBind() {
  this.JobNumber = JobNumber.bind(this);
  this.SourceFiles = SourceFiles.bind(this);
  this.OrderType = OrderType.bind(this);
  this.Priority = Priority.bind(this);
  this.Notes = Notes.bind(this);
  this.SubmitJobButton = SubmitJobButton.bind(this);
  this.FirstName = FirstName.bind(this)
  this.LastName = LastName.bind(this)
}

export default fieldBind;