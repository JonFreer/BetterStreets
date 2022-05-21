import NavBar from './navbar';
import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from './form';
import MapMain from './map_main';
class Main extends React.Component<{}, {}> {

    render() {
        return (
            <>
       <MapMain markerLat={52.0} markerLon={0}></MapMain>
       </>)
    }
}

export default Main;