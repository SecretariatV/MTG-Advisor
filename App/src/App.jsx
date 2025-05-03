// import { useEffect, useState } from 'react';
// import axios from 'axios';

import ChatContainer from './component/chat-container/chat-container.component'
import StockDirectory from "./component/stock-directory/stock-directory.component";
import InsiderDirectory from "./component/insider-directory/insider-directory.component"
import "./App.css"

function App() {

  return (
    <>
      <div className="parent-container">
        <InsiderDirectory className="container"/>
        <StockDirectory className="container"/>
        <ChatContainer className="container"/>
      </div>
    </>
  );
}

export default App;