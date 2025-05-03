// import { useEffect, useState } from 'react';
// import axios from 'axios';

import ChatContainer from "./component/chat-container/chat-container.comoponent";
import StockDirectory from "./component/stock-directory/stock-directory.component";
import InsiderDirectory from "./component/insider-directory/insider-directory.component"
import "./App.css"

function App() {

  // This is how we do this shit
  // useEffect(() => {
  //   axios.get('http://127.0.0.1:5000/bitch')
  //     .then(res => setMessage(res.data.message))
  //     .catch(err => {
  //       setMessage('Error fetching message')
  //       console.log(err)
  //     });
  // }, []);

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