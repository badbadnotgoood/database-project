import axios from "axios";

export const updateRestData = () => async (dispatch) => {
  await axios.get("./api/0.1.0/getRaiting").then((r) => {
    const data = r.data;
    dispatch({
      type: "UPDATE_REST_DATA",
      payload: data,
    });
  });
};

export const updateModalStatus = (status) => {
  return {
    type: "UPDATE_MODAL_STATUS",
    payload: status,
  };
};

export const updateAuthStatus = () => async (dispatch) => {
  await axios.get("./api/0.1.0/checkAuth").then((r) => {
    const data = r.data;
    dispatch({
      type: "UPDATE_AUTH_STATUS",
      payload: data,
    });
  });
};

export const updateCurrentCardName = (name) => {
  return {
    type: "UPDATE_CURRENT_CARD_NAME",
    payload: name,
  };
};

export const updateCurrentCardData = (name, metro) => async (dispatch) => {
  const cardInfo = await axios.post("./api/0.1.0/getCard", { restName: name });
  const cardReviews = await axios.post("./api/0.1.0/getCardReviews", {
    restName: name,
  });
  const cardNear = await axios.post("./api/0.1.0/getNearRests", {
    metro: metro,
  });
  dispatch({
    type: "UPDATE_CURRENT_CARD_DATA",
    payload: {
      info: cardInfo.data,
      reviews: cardReviews.data,
      near: cardNear.data,
    },
  });
};

export const clearCurrentCardName = () => {
  return {
    type: "UPDATE_CURRENT_CARD_NAME",
    payload: "",
  };
};

export const clearCurrentCardData = () => {
  return {
    type: "UPDATE_CURRENT_CARD_DATA",
    payload: {
      info: null,
      reviews: null,
      near: null,
    },
  };
};
