import styles from '../css/popup.module.css';
import { BsFlagFill } from 'react-icons/bs';
import React, { useRef, useEffect, useState } from 'react';
import { preProcessFile } from 'typescript';

function PopUp(props: { id: string, data: any, closeCallback: any, updateCallback:any }) {

    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [time, setTime] = useState(0);

    React.useEffect(() => {
        let interval = null;

        if (isActive && isPaused === false) {
            interval = setInterval(() => {
                setTime((time) => time + 10);
            }, 10);
        } else {
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isActive, isPaused]);

    const handleStart = () => {
        setIsActive(true);
        setIsPaused(false);
    };

    const handlePauseResume = () => {
        setIsPaused(!isPaused);
    };

    const handleReset = () => {
        setIsActive(false);
        setTime(0);
    };

    function submit() {




        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: parseInt(props.id), time: time })
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

    // var result = props.data.find(obj => {
    //     return obj.id== parseInt(props.id)
    //   })

    // console.log(result,props.id)
    if (props.data.type != "traffic_signals" && props.data.updated_type != "traffic_signals") {
        return (
            <div className={styles.outer}>
                <div className={styles.holder}>
                    <div>Is this a crossing with traffic signals?</div>
                    <div className="modal_footer">
                    <div className="modal_button cancel" onClick={() => submit_type(false)}>No</div>
                    <div className="modal_button save" onClick={() => submit_type(true)}>Yes</div>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div className={styles.outer}>
            <div className={styles.holder}>
                <h4>{props.data.type}</h4>
                <h3>Waiting Time : {Math.floor(props.data.time / 1000)}.{Math.floor((props.data.time % 1000) / 100)} Seconds</h3>
                <div className="modal_footer">{Math.floor(time / 1000)}.{Math.floor((time % 1000) / 100)} Seconds
                    <div className="modal_button cancel" onClick={() => handleReset()}>Reset</div>

                    {isActive ?

                        (isPaused ?
                            <div className="modal_button save" onClick={() => handlePauseResume()}>Resume</div>
                            : <div className="modal_button save" onClick={() => handlePauseResume()}>Stop</div>
                        ) :
                        <div className="modal_button save" onClick={() => handleStart()}>Start</div>
                    }
                </div>

                <div className="modal_button save" onClick={() => submit()}>Submit</div>


            </div>
        </div>
    )
}

export default PopUp;