import React from "react";

import { useStoreState } from '../hooks'


const BlockView: React.FC = () => {
  const data = useStoreState(state => state.script.data);


  return (
    <div>
    </div>
  );
}

export default BlockView