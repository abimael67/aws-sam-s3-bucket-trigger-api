import { SUCCESS, ERROR, ARCHIVING_JOB } from './../../../../constants/job_archiving_statuses'
import { COLOR_SUCCESS, COLOR_ERROR } from './../../../../constants/list_item_colors'

function selectBackgroundColor(){
  let status = this.ArchivedJobObject.jobArchiver.jobArchivingStatus
  if(status.includes('Success')){
    let temp = status.split(' ')
    if(temp[1] === temp[3])
      status = SUCCESS
    else
      status = ARCHIVING_JOB
  }
  //status = status.includes('Success') ? SUCCESS : status
  switch (status) {
    case SUCCESS:
      if(this.props.jobOrdinalNumber%2 === 1){
        return COLOR_SUCCESS;
      }
      else {
        return '#002f4b';
      }
    case ERROR:
      if(this.props.jobOrdinalNumber%2 === 1){
        return COLOR_ERROR;
      }
      else {
        return '#800000';
      }
    case ARCHIVING_JOB:
      return '#355E3B'
    default:
      return 'nonne';
  }
}

export default selectBackgroundColor;