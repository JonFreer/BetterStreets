import NavBar from './navbar';
import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from './form';
import { MapMain } from './map';
// class Main extends React.Component<{}, {}> {
function Main() {


    const [data, setData] = useState<any>([]);


    function getData(){
        const requestOptions = {
            method: 'GET',
            // headers: { 'Content-Type': 'multipart/form-data' },
            // body: formData
        };

        

        fetch('https://badlyparked.localhost/api/submissions', requestOptions)
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
       <MapMain data={data}></MapMain>
       </>)
    
}

export default Main;