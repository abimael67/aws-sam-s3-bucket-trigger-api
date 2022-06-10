import getCorrespondingRangeFolder from '../../../classes/jobArchiver/getCorrespondingRangeFolder';
import defined from './../../../utils/defined'

async function handleChange(event) {
  const { value, id } = event.target
  await this.setState({ [id]: value })
  if (id === 'jobNumber' && value.length >= 7 && this.state.sourceBucket === 'videoin01') {
    let range = await getCorrespondingRangeFolder(value)
    await this.setState({ rangeDestinationFolder: range });
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