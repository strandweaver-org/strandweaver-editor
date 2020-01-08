import scriptModel, {ScriptModel} from './Script';

export interface StoreModel {
  script: ScriptModel;
}
const storeModel: StoreModel = {
  script: scriptModel
};

export default storeModel;
