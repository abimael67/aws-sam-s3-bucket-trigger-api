import getCorrespondingRangeFolder from '../../../classes/jobArchiver/getCorrespondingRangeFolder';
import defined from './../../../utils/defined'
import JOB_ARCHIVING_CONSTANTS from '../../../constants/job-archiving'

async function handleChange(event) {
  const { value, id } = event.target
  await this.setState({ [id]: value })
  if (id === 'jobNumber' && value.length >= 7 && this.state.sourceBucket === JOB_ARCHIVING_CONSTANTS.SOURCE_BUCKETS.videoin01) {
    let {folder} = await getCorrespondingRangeFolder(value)
    console.log('TESTED: ', folder)
    await this.setState({ rangeDestinationFolder: folder });
  }
  else
    await this.setState({ rangeDestinationFolder: '' });

  if (
    defined(this.state)
  ) {
    this.ValidateJobArchivingFields();
  }
}

export default handleChange;