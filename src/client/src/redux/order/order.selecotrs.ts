import { RootState } from "../store";

export const orderSelector = (state: RootState) => state.orderReducer;
