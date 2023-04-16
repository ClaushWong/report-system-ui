import { REDUX_ACTIONS } from "@/stores/index";
import { IUser } from "@/app/models/api.models";

interface IAuthState {
  user?: IUser;
}

interface IAuthAction {
  type: string;
  payload: IAuthState;
}

export const reducer = (state: any = null, action: IAuthAction): IAuthState => {
  const { type, payload } = action;
  switch (type) {
    case REDUX_ACTIONS.SET_USER:
      let user = null;
      if (payload.user) {
        user = payload.user;
      }
      return { ...state, user };
    default:
  }
  return state;
};
