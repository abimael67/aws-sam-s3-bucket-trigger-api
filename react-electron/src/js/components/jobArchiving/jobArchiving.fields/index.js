import FormErrors from './formErrors'
import SourceFields from './sourceFields'
import SourceBucket from './sourceBucket'
import ArchiveJobButton from './archiveJobButton.js'
import DestinationFields from './destinationFields'
import JobNumberTextField from './jobNumberTextField'
import Year from './year'
import Month from './month'
import BrowseButton from './browseButton'
function fieldBind() {
  //^^//console.log("inside job Archiving fieldBind()...")
  this.SourceFields = SourceFields.bind(this)
  this.SourceBucket = SourceBucket.bind(this)
  this.BrowseButton = BrowseButton.bind(this);
  this.JobNumberTextField = JobNumberTextField.bind(this)
  this.ArchiveJobButton = ArchiveJobButton.bind(this)
  this.DestinationFields = DestinationFields.bind(this)
  this.Year = Year.bind(this)
  this.Month = Month.bind(this)

  this.FormErrors = FormErrors.bind(this)
}

export default fieldBind;