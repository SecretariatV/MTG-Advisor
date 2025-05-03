// import { useEffect, useState } from 'react';
// import axios from 'axios';
import Punk from "./components/Punk/Punk.component";

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
      <p>Stonks</p>
      <Punk/>
    </>
  );
}

export default App;