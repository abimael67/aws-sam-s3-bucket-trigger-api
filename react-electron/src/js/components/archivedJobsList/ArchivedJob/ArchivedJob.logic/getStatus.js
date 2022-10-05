import { SUCCESS, ARCHIVING_JOB } from './../../../../constants/job_archiving_statuses'

export default function getStatus(status){
    let newStatus = status
    if(status.includes('Success')){
        let temp = status.split(' ')
        if(temp[1] === temp[3])
          newStatus = SUCCESS
        else
        newStatus = ARCHIVING_JOB
    }
    return newStatus
}