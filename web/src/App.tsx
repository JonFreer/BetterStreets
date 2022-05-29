// import React from 'react';
import React, { useRef, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import MyMap from './Components/map';
import Main from './Components/main'
import Form from './Components/form'
import Submit from './Components/submit';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './Components/navbar';
import About from './Components/about';
function App() {

 
   
  
  return (
    <div className="App">
      
      <BrowserRouter>
      <NavBar></NavBar>
      <Routes>
        {/* <Route path="/" element={<Form />}> */}
          <Route index element={<Main />} />
          <Route path="submit" element={<Submit />} />
          <Route path="about" element={<About />} />

        {/* </Route> */}
      </Routes>
    </BrowserRouter>
     
    </div>
  );
}


export default App;
