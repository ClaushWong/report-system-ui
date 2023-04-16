import { REDUX_ACTIONS } from "@/stores/index";

export const reducer = (
  state: any = { settings: {} },
  update: { type: string; payload: any }
) => {
  const { type, payload } = update;
  switch (type) {
    case REDUX_ACTIONS.SET_GENERAL_SETTINGS:
      return { ...state, settings: payload };
    case REDUX_ACTIONS.SET_OPTIONS:
      return { ...state, options: payload };
    default:
  }
  return state;
};
