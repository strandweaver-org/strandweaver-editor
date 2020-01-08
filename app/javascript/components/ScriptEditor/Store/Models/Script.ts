import { action, Action } from 'easy-peasy';

export interface ScriptModel {
  setData: Action<ScriptModel, string>;
  data: string;
}

const scriptModel: ScriptModel = {
  setData: action((state, data) => {
    state.data = data;
  }),
  data: "",
};

export default scriptModel;
