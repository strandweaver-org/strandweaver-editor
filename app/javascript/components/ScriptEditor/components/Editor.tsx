import React, { useEffect } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-github";

import { useStoreActions, useStoreState } from "../hooks";

interface IEditorProps {
  initialData: string;
}

const Editor: React.FC<IEditorProps> = ({ initialData }) => {
  const setData = useStoreActions(actions => actions.script.setData);
  const data = useStoreState(state => state.script.data);

  useEffect(() => {
    setData(initialData);
  }, []);

  return (
    <div>
      <input type="hidden" id="script_data" name="script[data]" value={data} />
      <AceEditor
        mode="markdown"
        theme="github"
        name="ScriptEditor"
        value={data}
        onChange={setData}
      />
    </div>
  );
};

export default Editor;
