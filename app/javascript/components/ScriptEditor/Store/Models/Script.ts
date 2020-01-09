import { action, Action, computed, Computed } from 'easy-peasy';
import Engine from 'strandweaver-machine'

export interface ScriptModel {
  setData: Action<ScriptModel, string>;
  data: string;
  compilationResult: Computed<ScriptModel, number>;
}

const scriptModel: ScriptModel = {
  setData: action((state, data) => {
    state.data = data;
  }),
  compilationResult: computed(state => state.data.length),
  data: "",
};

export default scriptModel;
