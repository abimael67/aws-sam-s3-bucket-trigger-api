import { SUCCESS, ARCHIVING_JOB, ERROR } from './../../../../constants/job_archiving_statuses'

export default function getStatus(status){
    let newStatus = status
    if(status.includes('Success')){
        let temp = status.split(' ')
        if(temp[1] === temp[3])
          newStatus = SUCCESS
        else
        newStatus = ARCHIVING_JOB
    }else if(status.includes('Error(s)'))
      newStatus = ERROR
    return newStatus
}