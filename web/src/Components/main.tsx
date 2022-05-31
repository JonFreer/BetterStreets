import NavBar from './navbar';
import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import { BrowserRouter, Routes, Route,useParams } from "react-router-dom";

import { MapMain } from './map';
import ImgPopUp from './imgPopUp';
// class Main extends React.Component<{}, {}> {
function Main() {


    const [data, setData] = useState<any>([]);
    const [imgPopUpOpen, setImgPopUpOpen] = useState(false);
    let { id } = useParams();

    function getData(){
        const requestOptions = {
            method: 'GET',
            // headers: { 'Content-Type': 'multipart/form-data' },
            // body: formData
        };

        

        fetch('/api/submissions', requestOptions)
            .then(response => {
                console.log(response)
                if(response.status==200){
                    response.json().then((data) => {
                        console.log(data)
                        setData(data)
                            // navigate("/")     
                    });
                }else{
                    // setUploadState(0);
                }

        
            })
    }
    useEffect(()=>{
        getData();
    },[])
    

    
        return (
            <>
            {imgPopUpOpen?<ImgPopUp id={id} closeCallback={()=>{setImgPopUpOpen(false)}}  ></ImgPopUp>:<></>}
            <MapMain data={data} id={id} openImgPopUpCallback={()=>{console.log("hi");setImgPopUpOpen(true)}} ></MapMain>
       </>)
    
}

export default Main;