import { action, Action, computed, Computed } from 'easy-peasy';

export interface ScriptModel {
  setData: Action<ScriptModel, string>;
  data: string;
  compilationResult: <
}

const scriptModel: ScriptModel = {
  setData: action((state, data) => {
    state.data = data;
  }),
  compilationResult:
    data: "",
};

export default scriptModel;
