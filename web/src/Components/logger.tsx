import styles from '../css/popup.module.css';
import stopwatchCSS from '../css/stopwatch.module.css';
import { BsFillStopwatchFill, BsFlagFill } from 'react-icons/bs';
import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import { preProcessFile } from 'typescript';
import { ModalMetaData, ModalTextInput } from './modal';
import { IoCloseSharp } from "react-icons/io5";
// import { ModalInput } from './modal';

function Logger(props: { open: boolean, id: string, data: any, closeCallback: any, updateCallback: any, tutorialCallback:any }) {

    // const [isActive, setIsActive] = useState(false);
    // const [isPaused, setIsPaused] = useState(true);
    const [waitingTime, setWaitingTime] = useState(0);
    const [crossingTime, setCrossingTime] = useState(0);
    const [stage, setStage] = useState(0);
    // const [notesModalOpen, setNotesModalOpen] = useState(false)
    const [notes, setNotes] = useState("")
    const [stopwatchOpen, setStopwatchOpen] = useState(false)

    //When the id changes reset the timers
  

    function submit_type(signals) {

        console.log("Update type", signals);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: props.id, type: signals })
        };


        fetch('/api/set_type', requestOptions)
            .then(response => {
                console.log(response)
                if (response.status == 200) {
                    response.json().then((data) => {
                        // props.closeCallback()
                        console.log("success")

                        if (signals) {
                            props.updateCallback();
                        } else {
                            props.closeCallback();
                        }



                        // navigate("/")
                    });
                } else {
                    console.log("Failed Upload")
                }
            })
    }

    if (props.open) {
        setTimeout(() => document.getElementById('modal')?.classList.add(styles.open), 1)

        if ((props.data.type == null || !props.data.type.includes("traffic_signals")) && (props.data.updated_type == null || !props.data.updated_type.includes("traffic_signals"))) {
            return (
                <div id="modal" className={styles.outer}>
                    <div className={styles.holder}>
                        <button onClick={()=>props.closeCallback()} className={stopwatchCSS.exit}><IoCloseSharp /></button>
                        {/* <div className={styles.close} onClick={() => { props.closeCallback() }}>x</div> */}
                        <div className={stopwatchCSS.heading}>Is this a crossing with traffic signals?</div>
                        <div className="modal_footer">
                            <div className="modal_button cancel" onClick={() => props.closeCallback()}>Don't Know</div>
                            <div className="modal_button cancel" onClick={() => submit_type(false)}>No</div>
                            <div className="modal_button save" onClick={() => submit_type(true)}>Yes</div>
                        </div>
                    </div>
                </div>
            )
        }


        let waiting_time = 0;
        let crossing_time = 0;
        if (props.data.waiting_times != null) {
            let waiting_times_list = props.data.waiting_times.split(",")
            waiting_time = waiting_times_list[waiting_times_list.length - 1]
        }
        if (props.data.crossing_times != null) {
            let crossing_times_list = props.data.crossing_times.split(",")
            crossing_time = crossing_times_list[crossing_times_list.length - 1]
        }
        console.log(waiting_time,crossing_time)


        // const waiting_time = props.data.waiting_times;

        let times = <div className={stopwatchCSS.sub_heading}> No times currently logged. </div>


        if (waiting_time != 0){
            times = <div  className={styles.time_holder}> 
                        <span className={stopwatchCSS.sub_heading}>Waiting Time</span>
                        <span className={stopwatchCSS.sub_heading}>Crossing Time</span>
                        <span className={styles.time}>{crossing_time/1}s</span>
                        <span className={styles.time}>{waiting_time/1}s</span>
                    </div>

        }

        return (
            <>
                <div id="modal" className={styles.outer}>
                    <div className={styles.holder}>

                        <div className={stopwatchCSS.heading}>Times</div>

                        {times}


                        <button onClick={()=>{setStopwatchOpen(true); props.tutorialCallback(1)}} className={styles.survey_button}>Add Survey <BsFillStopwatchFill className={styles.icon} /></button>

                    
                        <div className={stopwatchCSS.grow_wrap}>
                            <textarea placeholder='Add note ...' className={stopwatchCSS.text_area} name="text" rows={1} id="text" onInput={(event: React.ChangeEvent<HTMLTextAreaElement>)=>{(event.target.parentNode as HTMLElement).dataset.replicatedValue = event.target.value;}}></textarea>
                        </div>
        
                        <div className={styles.timer_button_holder}>
                            <div className={styles.submit + " modal_button cancel"} onClick={() => {props.closeCallback(); props.tutorialCallback(6);}}>Cancel</div>
                            <div className={styles.submit + " modal_button save "}  onClick={() => {props.tutorialCallback(6);}}>Submit</div>
                        </div>

                    </div>

                </div>
    
                <Stopwatch open={stopwatchOpen} id={props.id} callbackCancel={()=>setStopwatchOpen(false)} successCallback={()=>{props.updateCallback();setStopwatchOpen(false)}} tutorialCallback={(val:number,data:any)=>{props.tutorialCallback(val,data)}}></Stopwatch>
            </>
        )
    }
    else {
        document.getElementById('modal')?.classList.remove(styles.open);
        return (<></>)
    }
}


function Stopwatch(props:{open:boolean, callbackCancel:any, id:string, successCallback:any, tutorialCallback:any}){

    const [waitingTime, setWaitingTime] = useState(0);
    const [crossingTime, setCrossingTime] = useState(0);
    const [state, setState] = useState(0);

    useEffect(() => {
        setWaitingTime(0);
        setCrossingTime(0);
        setState(0);
    }, [props.id])


    useEffect(() => {
        let intervalId;
        if (state==1) {
          // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
          intervalId = setInterval(() => {setWaitingTime(waitingTime + 1); 
            (document.getElementById("waiting_time") as HTMLInputElement).value = String(waitingTime+1);}, 1000);
        }
        return () => clearInterval(intervalId);
      }, [state, waitingTime]);

    useEffect(() => {
        let intervalId;
        if (state==2) {
          // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
          intervalId = setInterval(() => {setCrossingTime(crossingTime + 1);
            (document.getElementById("crossing_time") as HTMLInputElement).value = String(crossingTime+1);}, 1000);
        }
        return () => clearInterval(intervalId);
      }, [state, crossingTime]);

      function submit() {

        let waiting_time = (document.getElementById("waiting_time") as HTMLInputElement).value;
        let crossing_time = (document.getElementById("crossing_time") as HTMLInputElement).value;
        let notes = (document.getElementById("text") as HTMLTextAreaElement).value;

        console.log("submitting: %f %f %s ", waiting_time, crossing_time, notes)

        props.tutorialCallback(5,{ id: props.id, waiting_time: waiting_time, crossing_time: crossing_time, notes: notes })
        
        if (props.tutorialCallback != null){
            props.successCallback()
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: props.id, waiting_time: waiting_time, crossing_time: crossing_time, notes: notes })
        };

        fetch('/api/set_time', requestOptions)
            .then(response => {
                console.log(response)
                if (response.status == 200) {
                    response.json().then((data) => {
                        props.successCallback()
                    });
                } else {
                    console.log("Failed Upload")
                }
            })
    }

    let button = <></>
    if (state == 0){
        button = <button className={stopwatchCSS.button} onClick={()=>{setState(1); props.tutorialCallback(2)}}>Start Wait Period</button> 
    }else if(state ==1){
        button = <button className={stopwatchCSS.button} style={{background:"orange"}}onClick={()=>{setState(2);props.tutorialCallback(3)}}>Start Crossing Period</button> 
    }else if(state == 2){
        button = <button className={stopwatchCSS.button} style={{background:"red"}} onClick={()=>{setState(3);props.tutorialCallback(4)}}>End Crossing Period</button> 
    }else{
        button = <>
                    <div className={stopwatchCSS.grow_wrap}>
                        <textarea placeholder='Add note ...' className={stopwatchCSS.text_area} name="text" rows={1} id="text" onInput={(event: React.ChangeEvent<HTMLTextAreaElement>)=>{(event.target.parentNode as HTMLElement).dataset.replicatedValue = event.target.value;}}></textarea>
                    </div>
        
                    <div className={stopwatchCSS.button_holder}>
                        <button onClick={()=>{setState(0); setCrossingTime(0); setWaitingTime(0); props.tutorialCallback(1)}} className={stopwatchCSS.reset}> Reset </button>
                        <button className={stopwatchCSS.submit} onClick={()=>{submit();}}> Submit</button>
                    </div>
                </>
    }

    if(props.open){
        setTimeout(()=>document.getElementById('modal_stopwatch')?.classList.add(stopwatchCSS.open),1)
        return(
            
            <div className='modal_holder'>
                        <div id="modal_stopwatch" className={stopwatchCSS.stopwatch}>
                            <button onClick={()=>{props.callbackCancel();props.tutorialCallback(0)}} className={stopwatchCSS.exit}><IoCloseSharp /></button>
                            <h3  className={stopwatchCSS.heading}>Crossing Stopwatch</h3>

                            <div className={stopwatchCSS.sub_heading}>Waiting Time</div>
                            <div className={stopwatchCSS.time_holder} data-replicated-value={waitingTime}>
                                <input  id="waiting_time" className={stopwatchCSS.time} onInput={(event: React.ChangeEvent<HTMLInputElement>)=>{(event.target.parentNode as HTMLElement).dataset.replicatedValue = event.target.value;}} defaultValue={waitingTime}/>
                            </div>
                            <div className={stopwatchCSS.sub_heading}>Crossing Time</div>
                            <div className={stopwatchCSS.time_holder} data-replicated-value={crossingTime}>
                                <input id="crossing_time"  type="text" className={stopwatchCSS.time} onInput={(event: React.ChangeEvent<HTMLInputElement>)=>{(event.target.parentNode as HTMLElement).dataset.replicatedValue = event.target.value; }} defaultValue={crossingTime}/>
                            </div>

                       

                            {button}
                        </div>
                    </div>
                
        )
        
    }else{
            document.getElementById('modal_stopwatch')?.classList.remove(stopwatchCSS.open);
            return(<></>)
        }
}

export default Logger;