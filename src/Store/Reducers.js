import { combineReducers } from "redux";

const RestDataReducer = (data = [], action) => {
  if (action.type === "UPDATE_REST_DATA") {
    return action.payload;
  }
  return data;
};

const ModalStatusreducer = (status = 0, action) => {
  if (action.type === "UPDATE_MODAL_STATUS") {
    return action.payload;
  }
  return status;
};

const AuthStatusReducer = (status = 0, action) => {
  if (action.type === "UPDATE_AUTH_STATUS") {
    return action.payload;
  }
  return status;
};

const CurrentCardNameReducer = (name = "", action) => {
  if (action.type === "UPDATE_CURRENT_CARD_NAME") {
    return action.payload;
  }
  return name;
};

const CurrentCardDataReducer = (
  data = {
    info: null,
    reviews: null,
    near: null,
  },
  action
) => {
  if (action.type === "UPDATE_CURRENT_CARD_DATA") {
    return action.payload;
  }
  return data;
};

const rootReducer = combineReducers({
  restData: RestDataReducer,
  modalStatus: ModalStatusreducer,
  authStatus: AuthStatusReducer,
  currentCardName: CurrentCardNameReducer,
  currentCardData: CurrentCardDataReducer,
});

export default rootReducer;
