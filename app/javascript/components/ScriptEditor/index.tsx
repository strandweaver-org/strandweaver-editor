import React, { useEffect } from 'react';
import { StoreProvider } from 'easy-peasy';
import scriptEditorStore from './Store'
import Editor from './components/Editor';

interface IScriptEditorProps {
  initialData: string;
}

const ScriptEditor: React.FC<IScriptEditorProps> = ({ initialData }) => {

  return (
    <StoreProvider store={scriptEditorStore}>
      <Editor initialData={initialData} />
    </StoreProvider>
  );
}

export default ScriptEditor