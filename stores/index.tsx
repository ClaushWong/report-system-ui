import * as Reducers from "./reducers";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { createStore, combineReducers } from "redux";
import { useSelector } from "react-redux";

export const REDUX_ACTIONS = {
  SET_USER: "set_user",
  SET_GENERAL_SETTINGS: "set_general_settings",
  SET_OPTIONS: "set_options",
};

const reducers = combineReducers({
  auth: persistReducer({ key: "auth", storage }, Reducers.AuthReducer),
  setting: persistReducer({ key: "setting", storage }, Reducers.SettingReducer),
});

export const store = createStore(reducers, {});

export const persistor = persistStore(store as any);

export const useAppStore = () => {
  const state = useSelector<any, any>((state) => state);
  const { auth, setting } = state;
  return { auth, setting };
};

export const useAppAuthStore = () =>
  useSelector<any, any>(({ auth }) => {
    return auth ? { user: auth.user } : null;
  });

export const useAppSettingStore = () =>
  useSelector<any, any>(({ setting }) => setting);
