import React, { useEffect } from 'react';
import { StoreProvider } from 'easy-peasy';
import scriptEditorStore from './Store'
import Editor from './components/Editor';
import BlockView from './components/BlockView';

interface IScriptEditorProps {
  initialData: string;
}

const ScriptEditor: React.FC<IScriptEditorProps> = ({ initialData }) => {

  return (
    <StoreProvider store={scriptEditorStore}>
      <Editor initialData={initialData} />
      <BlockView />
    </StoreProvider>
  );
}

export default ScriptEditor