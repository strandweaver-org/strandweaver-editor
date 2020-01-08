import React, {useState} from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-github";

import {useStoreActions, useStoreState} from '../hooks'

const Editor: React.FC<IEditorProps> = () => {
    const setData = useStoreActions( actions => actions.script.setData);
  const data = useStoreState(state => state.script.data);
  return (
    <div> 
      <input type="hidden" id="script_data" name="script[data]" value={data}/>
      <AceEditor
      mode="markdown"
      theme="github"
      name="ScriptEditor"
      value={data}
      onChange={setData}
      />
    </div>
  );
}

export default Editor