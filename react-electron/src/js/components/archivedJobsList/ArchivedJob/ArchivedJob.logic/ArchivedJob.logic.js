import mapStateToProps from './mapStateToProps'
import selectStatusColor from './selectStatusColor'
import selectBackgroundColor from './selectBackgroundColor'
import getStatus from './getStatus'
function logicConstructor(props){
  this.selectStatusColor = selectStatusColor.bind(this)
  this.selectBackgroundColor = selectBackgroundColor.bind(this)
  this.getStatus = getStatus.bind(this)
  this.id = props.id
  this.ArchivedJobObject = props.ArchivedJobObject
}

export {
  mapStateToProps,
  logicConstructor
}