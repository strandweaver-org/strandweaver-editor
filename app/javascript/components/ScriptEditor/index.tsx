import React, {useEffect} from 'react';
import {StoreProvider} from 'easy-peasy';
import scriptEditorStore from './Store'
import Editor from './components/Editor';
import {useStoreActions} from './hooks'

interface IEditorProps {
  initialData: string;
}

const ScriptEditor: React.FC<IEditorProps> = ({initialData}) => {
  const setData = useStoreActions( actions => actions.script.setData);

  useEffect(() => { })
  const se

  const [data, setData]  = useState(initialData);
  
  return (
    <StoreProvider store={scriptEditorStore}>

    </StoreProvider>
  );
}

export default Editor