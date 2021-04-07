import defined from './../../../utils/defined'
import Logging from './../../../utils/logging'

function Clean(field) {
  if(!defined(field)){
    return ""
  } else {
    return field.replace(/\s+/g, '');
  }
}

function CheckForEmptyFields() {
  let areThereEmptyFields = true;
  const { jobNumber, sourceFiles } = this.state

  if(
    Clean(jobNumber) !== ''
    //&& defined(sourceFiles, "columns.column-1.docIds")
    //&& sourceFiles.columns["column-1"].docIds.length > 0
  ) {
    areThereEmptyFields = false;
  }


  return areThereEmptyFields;
}

export default CheckForEmptyFields;