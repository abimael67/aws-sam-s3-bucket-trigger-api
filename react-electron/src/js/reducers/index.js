// src/js/reducers/index.js
import { Auth } from 'aws-amplify'
import defined from './../utils/defined'
import DateUtils from './../utils/date-utils'
import Logging from './../utils/logging'
import { THEME_DARK, THEME_LIGHT } from './../constants/themes'
import { THEME } from './../constants/localStorageVariables'
import {
  ADD_SYNC_APP_TO_STORE,
  ADD_STITCH_APP_TO_STORE,
  ADD_MPEG_CONVERSION_APP_TO_STORE,
  ADD_ARTICLE,
  API_CALL_FINISHED,
  TOGGLE_JOB_DETAILS,
  CLEAR_STATE_ACTION,
  ALLOW_OPEN_DIALOG,
  DISALLOW_OPEN_DIALOG,
  REMOVE_DOC,
  USER_LOGGED_IN,
  LOG_OUT,
  TOGGLE_DARK_THEME,
  CHECK_USER_ACTIVITY,
  DRAGGING_JOB,
  ADD_ARCHIVED_JOB,
  JOB_ARCHIVING_FINISHED,
  JOB_ARCHIVING_PROGRESS,
  ADD_STITCHED_FILE,
  ADD_MPEG_CONVERSION_JOB,
  MPEG_CONVERSION_THIRD_PARTY_JOB_CREATED,
  RECEIVED_MPEG_CONVERSION_JOB_UPDATE,
  FILE_STITCHING_QUEUED,
  GET_STITCHING_JOB_STATUS_UPDATE
} from "../constants/action-types";
import { STITCH_VIEW, MPEG_CONVERSION_VIEW } from '../constants/view-names';

const getInitialState = () => ({
  allowOpenDialog: true,
  articles: [],
  user: null,
  theme: getPreferredTheme(),
  lastTimeOfActivity: new Date(),
  archivedJobs: [],
  archivingProgress: 0,
  stitchedFiles: [],
  mpegConversionVeriSuiteJobs: []
});

function getPreferredTheme() {
  let theme = localStorage.getItem(THEME)

  if(defined(theme) && theme === THEME_LIGHT) {
    return THEME_LIGHT
  }
  else {
    return THEME_DARK
  }
}

function rootReducer(state = getInitialState(), action) {
  switch(action.type) {
    case ADD_SYNC_APP_TO_STORE:
      return AddSyncAppToStoreReducer(state, action)
    case ADD_STITCH_APP_TO_STORE:
      return AddStitchAppToStoreReducer(state, action)
    case ADD_MPEG_CONVERSION_APP_TO_STORE:
      return AddMpegConversionAppToStoreReducer(state, action)
    case ADD_ARTICLE:
      return AddArticleReducer(state, action)
    case API_CALL_FINISHED:
      return APICallFinishedReducer(state, action)
    case TOGGLE_JOB_DETAILS:
      return ToggleJobDetailsReducer(state, action)
    case MPEG_CONVERSION_THIRD_PARTY_JOB_CREATED:
      return MpegConversionThirdPartyJobCreatedReducer(state, action)
    case RECEIVED_MPEG_CONVERSION_JOB_UPDATE:
      return ReceivedMpegConversionJobUpdateReducer(state, action)
    case CLEAR_STATE_ACTION:
      return ClearStateActionReducer(state, action)
    case DISALLOW_OPEN_DIALOG:
      return DisallowOpenDialogReducer(state, action)
    case ALLOW_OPEN_DIALOG:
      return AllowOpenDialogReducer(state, action)
    case REMOVE_DOC:
      return RemoveDocReducer(state, action)
    case USER_LOGGED_IN:
      return UserLoggedInReducer(state, action)
    case LOG_OUT:
      return LogOutReducer(state, action)
    case TOGGLE_DARK_THEME:
      return ToggleDarkThemeReducer(state, action)
    case CHECK_USER_ACTIVITY:
      return CheckUserActivityReducer(state, action)
    case DRAGGING_JOB:
      return DraggingJobReducer(state, action)

    case ADD_ARCHIVED_JOB:
      return AddArchivedJobReducer(state, action)
    case JOB_ARCHIVING_FINISHED:
      return JobArchivingFinishedReducer(state, action)
    case JOB_ARCHIVING_PROGRESS:
      return JobArchivingProgressReducer(state, action)
      
    case ADD_STITCHED_FILE:
      return AddStitchedFileReducer(state, action)
//ADD_MPEG_CONVERSION_JOB
    case ADD_MPEG_CONVERSION_JOB:
      return AddMpegConversionJobReducer(state, action)
    case FILE_STITCHING_QUEUED:
      return FileStitchingQueuedReducer(state, action)
    case GET_STITCHING_JOB_STATUS_UPDATE:
      return GetStitchingJobStatusUpdateReducer(state,action)

    default:
      return state;
  }
};

function AddSyncAppToStoreReducer(state, action) {
  //^^//console.log("AddSyncAppToStoreReducer action:");
  //^^//console.log(action);

  return Object.assign(
    {},
    state,
    {
      ...state,
      syncApp: action.payload.syncApp
    }
  )
}

function AddStitchAppToStoreReducer(state, action) {
return Object.assign(
    {},
    state,
    {
      ...state,
      stitchApp: action.payload.stitchApp
    }
  )
}

function AddMpegConversionAppToStoreReducer(state, action) {
  return Object.assign(
    {},
    state,
    {
      ...state,
      mpegConversionApp: action.payload.mpegConversionApp
    }
  )
}

function AddArticleReducer(state, action) {
  let articles = state.articles.concat(action.payload)
  articles.sort(function(a, b) {
    if(a.date.getTime() < b.date.getTime()) {
      // a happened before b, therefore a will be placed
      // second in the list, since we want to display them in
      // reverse chronological order
      return 1;
    }
    else {
      return -1;
    }
  })

  return Object.assign(
    {},
    state,
    { 
      ...state,
      articles: articles
    }
  );
}

function AddArchivedJobReducer(state,action){
  let archivedJobs = state.archivedJobs.concat(action.payload)

  archivedJobs.sort(function(a, b) {
    if(a.date.getTime() < b.date.getTime()) {
      // a happened before b, therefore a will be placed
      // second in the list, since we want to display them in
      // reverse chronological order
      return 1;
    }
    else {
      return -1;
    }
  })

  return Object.assign(
    {},
    state,
    {
      ...state,
      archivedJobs: archivedJobs
    }
  )
}

function AddStitchedFileReducer(state,action){
  let stitchedFiles = state.stitchedFiles.concat(action.payload)

  stitchedFiles.sort(function(a,b) {
    if(a.date.getTime() < b.date.getTime()) {
      // a happened before b, therefore a will be placed
      // second in the list, since we want to display them in
      // reverse chronological order
      return 1
    }
    else {
      return -1
    }
  })

  return Object.assign(
    {},
    state,
    {
      ...state,
      stitchedFiles: stitchedFiles
    }
  )
}

function AddMpegConversionJobReducer(state, action) {
  let mpegConversionVeriSuiteJobs = state.mpegConversionVeriSuiteJobs.concat(action.payload)

  DateUtils.SortArrayByReverseElement$_dot_$date(mpegConversionVeriSuiteJobs)

  return Object.assign(
    {},
    state,
    {
      ...state,
      mpegConversionVeriSuiteJobs: mpegConversionVeriSuiteJobs 
    }
  )
}

function APICallFinishedReducer(state, action) {
  return Object.assign(
    {},
    state,
    {
      ...state,
      articles: state.articles
    }
  );
}

function JobArchivingFinishedReducer(state, action) {
  return Object.assign(
    {},
    state,
    {
      ...state,
      archivedJobs: state.archivedJobs
    }
  )
}

function JobArchivingProgressReducer(state, action) {
  console.log('Red: ', action)
  return Object.assign(
    {},
    state,
    {
      ...state,
      archivingProgress: action.payload
    }
  )
}
function FileStitchingQueuedReducer(state, action) {
  Logging.log("Inside FileStitchingQueuedReducer. state:", state, "action:", action)
  return Object.assign(
    {},
    state,
    {
      ...state,
      stitchedFiles: state.stitchedFiles,
      action: action
    }
  )
}
function GetStitchingJobStatusUpdateReducer(state, action) {
  Logging.log("Inside GetStitchingJobStatusUpdateReducer. state:", state, "action:", action)
  return Object.assign(
    {},
    state,
    {
      ...state,
      stitchedFiles: state.stitchedFiles
    }
  )
}
function ToggleJobDetailsReducer(state, action) {
  //^^//console.log("Inside ToggleJobDetailsReducer");

  return Object.assign(
    {},
    state,
    { 
      ...state,
      articles: state.articles,
      action: action
    }
  );
}

function MpegConversionThirdPartyJobCreatedReducer(state, action) {
  //^^//console.log(" Inside MpegConversionThirdPartyJobCreatedReducer(state, action)...")

  return Object.assign(
    {},
    state,
    {
      ...state,
      action: action
    }
  )
}

function ReceivedMpegConversionJobUpdateReducer(state, action) {
  //^^//console.log("Inside ReceivedMpegConversionJobUpdateReducer(state, action)...")

  return Object.assign(
    {},
    state,
    {
      ...state,
      action: action
    }
  )
}

function ClearStateActionReducer(state, action) {
  //^^//console.log("Inside ClearStateAction()");

  return Object.assign(
    {},
    state,
    {
      ...state,
      action: null 
    }
  );
}

function DisallowOpenDialogReducer(state, action) {
  //^^//console.log("Inside DisallowOpenDialogReducer");

  return Object.assign(
    {},
    state,
    {
      ...state,
      allowOpenDialog: false
    }
  );
}

function AllowOpenDialogReducer(state, action) {
  //^^//console.log("Inside AllowOpenDialogReducer");

  return Object.assign(
    {},
    state,
    {
      ...state,
      allowOpenDialog: true
    }
  );
}

function RemoveDocReducer(state, action) {
  //^^//console.log("#######>>>>>Inside RemoveDocReducer");
  //^^//console.log("this:")
  //^^//console.log(this)
  //^^//console.log("state:");
  //^^//console.log(state);
  //^^//console.log("action:");
  //^^//console.log(action);

  let draggableId = action.payload.draggableId;

  //let syncApp = state.syncApp;
  //let stitchApp = state.stitchApp;
  let app;

  if (
    defined(action.payload.parentViewName)
    && action.payload.parentViewName === STITCH_VIEW
  ) {
    app = state.stitchApp;
  } 
  else if(
    defined(action.payload.parentViewName)
    && action.payload.parentViewName === MPEG_CONVERSION_VIEW
  ) {
    app = state.mpegConversionApp;
  } 
  else {
    app = state.syncApp;
  }

  app.RemoveDoc(draggableId);

  let newDocs = app.state.sourceFiles.docs;
  delete newDocs[action.payload.draggableId];

  return Object.assign(
    {},
    state,
    {
      ...state,
      action: action
    }
  );
}

function UserLoggedInReducer(state, action) {
  //^^//console.log("Inside UserLoggedInReducer");

  //^^//console.log("UserLoggedInReducer action:");
  //^^//console.log(action);

  return Object.assign(
    {},
    state,
    {
      ...state,
      user: action.payload.user
    }
  )
}

function LogOutReducerCommonCode(state, action) {
  //^^//console.log("Inside LogOutReducerCommonCode");

  try {
    Auth.signOut({ global: true });
  }
  catch(error) {
    let e = null;
    !error.message ? e = { "message" : error } : e = error;

    Logging.logError("Error signing out:", e)
  }
  let newState = getInitialState();
  return Object.assign(
    {},
    state,
    newState
  )
}

function LogOutReducer(state, action) {
  //^^//console.log("Inside LogOutReducer");

  //^^//console.log("LogOutReducer state:");
  //^^//console.log(state)

  //^^//console.log("LogOutReducer action:");
  //^^//console.log(action);
  
  action.payload.that.props.history.push("/login")

  return LogOutReducerCommonCode(state, action);
}

function ToggleDarkThemeReducer(state, action) {
  //^^//console.log("Inside ToggleDarkThemeReducer");
  
  let theme = state.theme;
  if(theme === THEME_DARK) {
    theme = THEME_LIGHT
  }
  else {
    theme = THEME_DARK
  }
  
  localStorage.setItem(THEME, theme)
  
  return Object.assign(
    {},
    state,
    {
      ...state,
      action: action,
      theme: theme
    }
  )
}

function CheckUserActivityReducer(state, action) {
  //^^//console.log("Inside CheckUserActivityReducer")
  let timeoutGracePeriodInHours = 2
  let timeoutGracePeriodInMilliseconds = timeoutGracePeriodInHours * 60 * 60 * 1000

  if(
    defined(state.user)
    && (
      !defined(state.lastTimeOfActivity)
      || (state.lastTimeOfActivity.getTime() + timeoutGracePeriodInMilliseconds) < (new Date()).getTime()
    )
  ) {
    //^^//console.log("CheckUserActivity() sending to LogOutReducerCommonCode...")
    return LogOutReducerCommonCode(state, action)
  }
  else {
    return Object.assign(
      {},
      state,
      {
        ...state,
        action: action
      }
    )
  }
}

function DraggingJobReducer(state, action) {
  //^^//console.log("Inside DraggingJobReducer...")

  return Object.assign(
    {},
    state,
    {
      ...state,
      action: action
    }
  )
}

export default rootReducer;

