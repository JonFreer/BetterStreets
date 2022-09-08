import styles from '../css/popup.module.css';
import { BsFlagFill } from 'react-icons/bs';
import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import { preProcessFile } from 'typescript';
import { ModalMetaData, ModalTextInput } from './modal';
// import { ModalInput } from './modal';

function PopUp(props: { open:boolean,id: string, data: any, closeCallback: any, updateCallback:any }) {

    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [waitingTime, setWaitingTime] = useState(0);
    const [crossingTime, setCrossingTime] = useState(0);
    const [stage,setStage] = useState(0);
    const [notesModalOpen,setNotesModalOpen] = useState(false)
    const [notes,setNotes] = useState("")

 

    useEffect(() => {    
        if( props.data == undefined){
            setNotes("")
            return;
        }
        if(props.data.notes != null){
                let notes_list = props.data.notes.split(",")
                setNotes(notes_list[notes_list.length-1])
        }else{
            setNotes("")
        }
        // Update the document title using the browser API    document.title = `You clicked ${count} times`;  
    },[props.data]);

    React.useEffect(() => {
        let interval = null;

        if (isActive && isPaused === false) {
            interval = setInterval(() => {
                if(stage == 0){
                    setWaitingTime((time) => time + 10);

                }else{
                    setCrossingTime((time) => time + 10);

                }
            }, 10);
        } else {
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isActive, isPaused,stage]);

    const handleStart = () => {
        setIsActive(true);
        setIsPaused(false);
    };

    const handlePauseResume = () => {
        setIsPaused(!isPaused);
    };

    const handleMove = () => {
        setStage(1)
    }

    const handleReset = () => {
        setIsActive(false);
        setStage(0);
        setWaitingTime(0);
        setCrossingTime(0);
    };

    function submit() {




        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: parseInt(props.id), waiting_time: waitingTime,crossing_time:crossingTime,notes:notes })
        };


        fetch('/api/set_time', requestOptions)
            .then(response => {
                console.log(response)
                if (response.status == 200) {
                    response.json().then((data) => {
                        props.closeCallback()
                        // navigate("/")
                    });
                } else {
                    console.log("Failed Upload")
                }


            })
    }

    function submit_type(signals){

        console.log("Update type",signals);
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: parseInt(props.id), type: signals })
        };


        fetch('/api/set_type', requestOptions)
            .then(response => {
                console.log(response)
                if (response.status == 200) {
                    response.json().then((data) => {
                        // props.closeCallback()
                        console.log("success")

                        if(signals){
                            props.updateCallback();
                        }else{
                            props.closeCallback();
                        }

                        

                        // navigate("/")
                    });
                } else {
                    console.log("Failed Upload")
                }
            })
    }

    function setDate(){

    }

    // var result = props.data.find(obj => {
    //     return obj.id== parseInt(props.id)
    //   })

    // console.log(result,props.id)
    if(props.open){
        setTimeout(()=>document.getElementById('modal')?.classList.add(styles.open),1)

    if ( (props.data.type==null||!props.data.type.includes("traffic_signals")) && (props.data.updated_type==null||!props.data.updated_type.includes("traffic_signals"))) {
        return (
            <div id="modal" className={styles.outer}>
                <div className={styles.holder}>
                     <div className={styles.close} onClick={()=>{props.closeCallback()}}>x</div>
                    <div>Is this a crossing with traffic signals?</div>
                    <div className="modal_footer">
                    <div className="modal_button cancel" onClick={() => submit_type(false)}>No</div>
                    <div className="modal_button save" onClick={() => submit_type(true)}>Yes</div>
                    </div>
                </div>
            </div>
        )
    }

    
    let waiting_time = 0;
    let crossing_time = 0;
    if(props.data.waiting_times != null){
        let waiting_times_list = props.data.waiting_times.split(",")
        waiting_time = waiting_times_list[waiting_times_list.length-1]
    }
    if(props.data.crossing_times != null){
        let crossing_times_list = props.data.crossing_times.split(",")
        crossing_time = crossing_times_list[crossing_times_list.length-1]
    }

   
    // const waiting_time = props.data.waiting_times;
    

    return (
        <>
        <div id="modal" className={styles.outer}>
            <div className={styles.holder}>
                {/* <div className={styles.close} onClick={()=>{props.closeCallback()}}>x</div> */}
                {/* <h4>{waitingTime}:{crossingTime}</h4> */}
                {/* <h3>Waiting Time : {Math.floor(waiting_time/ 1000)}.{Math.floor((waiting_time % 1000) / 100)} Seconds</h3> */}

                <div className={styles.notes_heading}>Times</div>
                <div className={styles.modal_times}>
                    
                    <ModalInput label="Waiting (s)" default={waitingTime==0?Math.floor(waiting_time/100)/10:Math.floor(waitingTime/100)/10} min={0} max={1000} maxLen={12}
                            id={"waiting_input"}
                            callback={(val: number) => {
                                // var date_temp = new Date(date.getTime());
                                // date_temp.setDate(val)
                                // setDate(x)
                                setWaitingTime(val*1000)
                            }}
                        />
                        <ModalInput label="Crossing (s)" default={crossingTime==0?Math.floor(crossing_time/100)/10:Math.floor(crossingTime/100)/10} min={0} max={1000} maxLen={12}
                            id={"crossing_input"}
                            callback={(val: number) => {
                              setCrossingTime(val*1000)
                            }} />
                    {/* <div className ={styles.time}>Waiting Time: {Math.floor(time / 1000)}.{Math.floor((time % 1000) / 100)} Seconds</div> */}
                    <div className="modal_button cancel" onClick={() => handleReset()}>Reset</div>

                    {isActive ?
                        (stage == 0 ?
                            <div className="modal_button save" onClick={() => handleMove()}>Next</div>
                            : <div className="modal_button save" onClick={() => handlePauseResume()}>Stop</div>
                        ) :
                        <div className="modal_button save" onClick={() => handleStart()}>Start</div>
                    }


                </div>
                <div className={styles.notes_holder}>
                    
                    <div className={styles.notes_heading}>Notes</div>
                    {notes!=""?
                    <div onClick={()=>setNotesModalOpen(true)} className={styles.notes_main}>{notes}</div>:
                    <div onClick={()=>setNotesModalOpen(true)}className={styles.notes_main}>Click to add notes</div>

                }
                </div>
                <div className={ styles.submit+" modal_button save "} onClick={() => submit()}>Submit</div>


            </div>
       
        </div>
        <ModalTextInput open={notesModalOpen}

                text={notes}
                    
                callbackSave={(notes) => {
                    setNotesModalOpen(false);
                    setNotes(notes);
                    // setMetaModalActive(false);
                    // updateMetaDate(metaData);
                    // this.setState({ metadataModalActive: false })

                }}
                callbackCancel={() => {
                    // setMetaModalActive(false);
                    setNotesModalOpen(false)
                    // this.setState({ metadataModalActive: false })

                }}></ModalTextInput>
        </>
    )}
    else{
        document.getElementById('modal')?.classList.remove(styles.open);
        return(<></>)
    }
}


function ModalInput(props: { label: string, default: number, min: number, max: number, maxLen: number, callback: any,id:string }) {

    const [active, setActive] = useState(false);

    function onUpdate(event: ChangeEvent) {
        let value = Number((event.target as HTMLInputElement).value);
        if (value >= props.min && value <= props.max) {
            console.log("in bounds", props.default)
            props.callback(value)
        } else {
            (event.target as HTMLInputElement).value = String(props.default) ;
        }
        setActive(false)
    }

    React.useEffect(() => {

        (document.getElementById(props.id) as HTMLInputElement).value = String(props.default) ;
      
      }, [props.default]);

    return (
        <div className={'modal_inner '+styles.modal_inner}>
            <div className="modal_input ">
                <label className={!active ? 'modal_input_inner ' : 'modal_input_inner active'}>
                    <span className={!active ? 'modal_input_header' : 'modal_input_header active'}>
                        {props.label}
                    </span>
                    <input id={props.id} type='text' pattern="\d*" maxLength={props.maxLen} className='modal_input_input'
                        defaultValue={props.default} min={props.min} max={props.max}
                        onBlur={(event) => onUpdate(event)}
                        onFocus={(event) => {
                            setActive(true)
                            event.target.select()
                        }} />
                </label>
                <span className={!active ? 'modal_input_line' : 'modal_input_line active'}>

                </span>
            </div>

        </div>)
}

export default PopUp;