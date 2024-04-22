import NavBar from './navbar';
import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import { BrowserRouter, Routes, Route,useParams } from "react-router-dom";
import tutorialCSS from '../css/tutorial.module.css';
import { MapMain } from './map';
import PopUp from './popup';
import Logger from './logger';
import { BiMessageAltAdd } from 'react-icons/bi';
// class Main extends React.Component<{}, {}> {
function Main() {


    const [data, setData] = useState<any>([]);
    const [popupOpen, setPopUpOpen] = useState(false);
    // let { id } = useParams();
    const [id, setId] = useState<string>("0");
    const [tutorialState, setTutorialState] = useState<number>(window.localStorage.getItem("tutorial_complete")=="True"?8:0);
    const [tutorialData,setTutorialData] = useState([{ id: "ffef8460-17bb-4c10-b5b3-daeac899b01b", osm_id: 910427655, lat: 52.4704013, lon: -1.8764627, waiting_times: null, crossing_times: null, notes: null, type: "traffic_signals", updated_type: null, state: 1 }])
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
                                     if(data[i].waiting_times.split(",")[data[i].waiting_times.split(",").length-1]==0){
                                        data[i].state = 1;
                                     }
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
    

    function process_tutorial(val,data){
        setTutorialState(val);
        if(val == 5){
            const temp_data = tutorialData;
            temp_data[0].waiting_times = data.waiting_time
            temp_data[0].crossing_times = data.crossing_time
            temp_data[0].state = 2
            setTutorialData([].concat(temp_data))
        }

        if (val == 7 && data != null){
            const temp_data = tutorialData;
            temp_data.push({ id: "new", osm_id: 2, lat: data.lat, lon: data.lng, waiting_times: null, crossing_times: null, notes: null, type: "traffic_signals", updated_type: null, state: 1 })
            setTutorialData([].concat(temp_data))
        }

        // if (val == 8){
        //     console.log("Tutorial Complete")
        // }
    }
    if (tutorialState < 8){
        return (
                <>
                <TutorialModal id={id} tutorialState={tutorialState} tutorialCallback={(val:number)=>{setTutorialState(val)}}></TutorialModal>
                {/* {imgPopUpOpen?<ImgPopUp id={id} closeCallback={()=>{setImgPopUpOpen(false)}}  ></ImgPopUp>:<></>} */}
                <Logger open={popupOpen} id={id} data={tutorialData.find(obj => {return obj.id== id})} closeCallback={()=>{setPopUpOpen(false); getData()}}  
                updateCallback={()=>{getData()}} 
                tutorialCallback={(val:number,data:any)=>{process_tutorial(val,data)}} ></Logger>

                <MapMain data={tutorialData} id={id} openImgPopUpCallback={()=>{console.log("hi"); setPopUpOpen(true)}}
                setIdCallback={(id)=>{setId(id)}}  updateCallback={()=>{getData()}} tutorialCallback={(val:number,data:any)=>process_tutorial(val,data)}
                ></MapMain>
        </>
   )}

        return (
            <>
            {/* {imgPopUpOpen?<ImgPopUp id={id} closeCallback={()=>{setImgPopUpOpen(false)}}  ></ImgPopUp>:<></>} */}
            <Logger open={popupOpen} id={id} data={data.find(obj => {return obj.id== id})} closeCallback={()=>{setPopUpOpen(false); getData()}}  
            updateCallback={()=>{getData()}} tutorialCallback={()=>{}}></Logger>

            <MapMain data={data} id={id} openImgPopUpCallback={()=>{console.log("hi"); setPopUpOpen(true)}}
            setIdCallback={(id)=>{setId(id)}}  updateCallback={()=>{getData()}} tutorialCallback={(val:number)=>{}} 
            ></MapMain>
       </>
       )
    
}

function TutorialModal(props:{id: String, tutorialState: number, tutorialCallback: any}){

    if (props.id == "0"){
        return(<div className={tutorialCSS.modal}>
            <span  className={tutorialCSS.heading}>Hello!</span>
            <div>
                {/* This tool is designed to allow the wider community collect Traffic Crossing data. */}
                In this tutorial you will learn how to collect waiting and crossing times.
                <br/>
                <br/>
                First let's explore the map. On the map you should see a marker representing a crossing that has yet to be surveyed.
                <br/>
                <br/>
                <b>Tap on the marker!</b>
            </div>
        </div>)
    }

    if( props.tutorialState == 0){
        return(<div className={tutorialCSS.modal}>
            {/* <span  className={tutorialCSS.heading}>Hello!</span> */}
            <div>
                {/* This tool is designed to allow the wider community collect Traffic Crossing data. */}
                As you can see, this crossing has not been surveyed yet. 
                Lets pretend we are there and survey it.
                <br/>
                <br/>
                <b>Press "Add Survey"</b>
            </div>
        </div>)
    }

    if( props.tutorialState == 1){
        return(<div className={tutorialCSS.modal}>
            {/* <span  className={tutorialCSS.heading}>Hello!</span> */}
            <div>
                {/* This tool is designed to allow the wider community collect Traffic Crossing data. */}
                This is the stop watch. Here we will time the two crossing phases. 
                <br/>
                <br/>
                First we will time the waiting phase. When you press the WAIT button at the crossing, press "Start Wait Period" to start the stopwatch.

                <br/>
                <br/>
                <b>Press "Start Wait Period"</b>
            </div>
        </div>)
    }

    if( props.tutorialState == 2){
        return(<div className={tutorialCSS.modal}>
            {/* <span  className={tutorialCSS.heading}>Hello!</span> */}
            <div>
                {/* This tool is designed to allow the wider community collect Traffic Crossing data. */}
                We are now timing the waiting period. The next step is the crossing phase.
                <br/>
                <br/>
                When the pedestrian stage starts, "the green man", press "Start Crossing Period"
                <br/>
                <br/>
                <b>Press "Start Crossing Period"</b>
            </div>
        </div>)
    }
    
    if( props.tutorialState == 3){
        return(<div className={tutorialCSS.modal}>
            {/* <span  className={tutorialCSS.heading}>Hello!</span> */}
            <div>
                {/* This tool is designed to allow the wider community collect Traffic Crossing data. */}
                We are now timing the length of the pedestrian phase. When the green man no longer shows, press "End Crossing Period".
                <br/>
                <br/>
                <b>Press "End Crossing Period"</b>
            </div>
        </div>)
    }

    if( props.tutorialState == 4){
        return(<div className={tutorialCSS.modal}>
                {/* <span  className={tutorialCSS.heading}>Hello!</span> */}
                <div>
                    {/* This tool is designed to allow the wider community collect Traffic Crossing data. */}
                    Great Job!  
                    <br/>
                    <br/>
                    Now we can edit any of the data if needed, or add a note to add some more detail about this survey.

                    <br/>
                    <br/>
                    <b>Add a note and click submit</b>
                </div>
        </div>)
    }

    if( props.tutorialState == 5){
        return(<div className={tutorialCSS.modal}>
                {/* <span  className={tutorialCSS.heading}>Hello!</span> */}
                <div>
                    {/* This tool is designed to allow the wider community collect Traffic Crossing data. */}
                    The data has now been logged and the marker has been updated to a tick.
                    <br/>
                    <br/>
                    We can amend this data at any point by clicking "Add Survey" again.
                    We can also add a note for this crossing that everyone can see. Add a note and click submit.
                    <br/>
                    <br/>   
                    <b>Add a note and click submit</b>

                    {/* <button className={tutorialCSS.button}>Next</button> */}
                </div>
        </div>)
    }

    if( props.tutorialState == 6){
        return(<div className={tutorialCSS.modal_lower}>
                <span  className={tutorialCSS.heading}>One last thing....</span>
                <div>
                    <br/>   
                    Sometimes a crossing in real life may not be on the map. In this case we can add the crossing ourselves.
                    To do this we use the <BiMessageAltAdd></BiMessageAltAdd> button in the top left.
                    <br/>
                    <br/>
                    <b>Tap the <BiMessageAltAdd></BiMessageAltAdd> to add a crossing to the map</b>
                </div>
        </div>)
    }

    if( props.tutorialState == 7){
        return(<div className={tutorialCSS.modal}>
                <span className={tutorialCSS.heading}>Awesome!</span>
                <div>
                    <br/>   
                    You are all ready to start surveying. If you need any help or want to run through this
                     tutorial again, check out the About section. 
                     <br/>   
                     <br/>   
                     <b>Thank you for contributing!</b>
                     {/* <br/>    */}
                     <button onClick={()=>{props.tutorialCallback(8);window.localStorage.setItem("tutorial_complete", "True");}}  className={tutorialCSS.button}>Lets Go!</button>
                </div>
        </div>)
    }

   
}

export default Main;