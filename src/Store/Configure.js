import { persistStore, persistReducer } from "redux-persist";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./Reducers";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, applyMiddleware(thunk));
const Persistor = persistStore(store);

export { Persistor };
export default store;
