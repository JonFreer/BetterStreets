import NavBar from './navbar';
import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import { BrowserRouter, Routes, Route,useParams } from "react-router-dom";

import { MapMain } from './map';
import PopUp from './popup';
// class Main extends React.Component<{}, {}> {
function Main() {


    const [data, setData] = useState<any>([]);
    const [popupOpen, setPopUpOpen] = useState(false);
    // let { id } = useParams();
    const [id, setId] = useState<string>("0");
    function getData(){
        const requestOptions = {
            method: 'GET',
            // headers: { 'Content-Type': 'multipart/form-data' },
            // body: formData
        };

        

        fetch('/api/crossings', requestOptions)
            .then(response => {
                console.log(response)
                if(response.status==200){
                    response.json().then((data) => {
                        console.log(data)
                        // Set the current state of the crossings
                        // 0: Undefined crossing
                        // 1: Traffic singals with no data
                        // 2: Complete crossing
                        for(let i = 0; i< data.length;i++){
                            if((data[i].type==null||!data[i].type.includes("traffic_signals")) && (data[i].updated_type==null||!data[i].updated_type.includes("traffic_signals"))){
                                data[i].state = 0;
                            }else{
                                if(data[i].waiting_times!="" && data[i].waiting_times!= null){
                                    
                                    data[i].state = 2;
                                }else{

                                    data[i].state = 1;
                                }
                                
                            }
                        }

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
    
    // console.log("data",id)
    // console.log(data.find(obj => {return obj.id=== id}))
        return (
            <>
            {/* {imgPopUpOpen?<ImgPopUp id={id} closeCallback={()=>{setImgPopUpOpen(false)}}  ></ImgPopUp>:<></>} */}
            <PopUp open={popupOpen} id={id} data={data.find(obj => {return obj.id== id})} closeCallback={()=>{setPopUpOpen(false); getData()}}  
            updateCallback={()=>{getData()}}  ></PopUp>
            <MapMain data={data} id={id} openImgPopUpCallback={()=>{console.log("hi");setPopUpOpen(true)}}
            setIdCallback={(id)=>{setId(id)}}
            ></MapMain>
       </>)
    
}

export default Main;