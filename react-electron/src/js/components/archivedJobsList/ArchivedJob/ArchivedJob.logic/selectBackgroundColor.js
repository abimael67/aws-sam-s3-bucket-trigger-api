import { SUCCESS, ERROR, ARCHIVING_JOB } from './../../../../constants/job_archiving_statuses'
import { COLOR_SUCCESS, COLOR_ERROR } from './../../../../constants/list_item_colors'

function selectBackgroundColor(){
  let status = this.getStatus(this.ArchivedJobObject.jobArchiver.jobArchivingStatus)
 
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