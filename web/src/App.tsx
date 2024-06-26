// import React from 'react';
import React, { useRef, useEffect, useState } from 'react';
import logo from './bs4b.svg';
import './App.css';

import Main from './Components/main'
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
          <Route path="about" element={<About />} />
          <Route path="/:id" element={<Main />} />

        {/* </Route> */}
      </Routes>
    </BrowserRouter>
     
    </div>
  );
}


export default App;
