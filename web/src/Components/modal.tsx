import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import ImageUploading from 'react-images-uploading';
import { ExifParserFactory } from "ts-exif-parser";
import exifr from 'exifr'
import './form.css'

function ModalDateTime(props:{open:boolean,callbackSave:any, callbackCancel:any}){

    // const [active, setActive] = useState(false);
    const [date, setDate] = useState(new Date());
    

    if(props.open){
        setTimeout(()=>document.getElementById('modal')?.classList.add('open'),1)
    return(
        
        <div className='modal_holder'>
                    <div id="modal" className='TimeDateModal'>
                        <div className='modal_head'>
                            Edit date and time
                            <div className='modal_current_date'>
                                {date.toLocaleDateString('en-UK', { weekday: 'long' })}, {date.toLocaleDateString('en-UK', { day: '2-digit' })} {date.toLocaleDateString('en-UK', { month: 'long' })} {date.toLocaleDateString('en-UK', { year: 'numeric' })}, {date.toLocaleTimeString('en-UK', { hour: 'numeric', hour12: true }).toLocaleUpperCase()}
                            </div>
                        </div>

                        <ModalInput label="Day" default={date.getDate()} min={1} max={32} maxLen={2}
                            callback={(val: number) => {
                                var date_temp = new Date(date.getTime());
                                date_temp.setDate(val)
                                setDate(date_temp)
                            }}
                        />
                        <ModalInput label="Month" default={date.getMonth() + 1} min={1} max={12} maxLen={2}
                            callback={(val: number) => {
                                var date_temp = new Date(date.getTime());
                                date_temp.setMonth(val - 1)
                                setDate(date_temp)
                            }} />
                        <ModalInput label="Year" default={date.getFullYear()} min={1} max={date.getFullYear()} maxLen={4}
                            callback={(val: number) => {
                                var date_temp = new Date(date.getTime());
                                date_temp.setFullYear(val)
                                setDate(date_temp)
                            }} />
                        <ModalInput label="Hour" default={date.getHours()} min={0} max={23} maxLen={2}
                            callback={(val: number) => {
                                var date_temp = new Date(date.getTime());
                                date_temp.setHours(val)
                                setDate(date_temp)
                            }} />
                        <div className="modal_footer">
                            <div className="modal_button cancel" onClick={()=>props.callbackCancel()}>Cancel</div>
                            <div className="modal_button save" onClick={()=>props.callbackSave(date)}>Save</div>
                        </div>


                    </div>


                </div>
            
    )}else{
        document.getElementById('modal')?.classList.remove('open');
        return(<></>)
    }
}

function ModalMetaData(props:{open:boolean,callbackSave:any, callbackCancel:any}){
    // useEffect(() => {
    //     document.getElementById('modal')?.classList.add('open');
    // })

    
    if(props.open){
        setTimeout(()=>document.getElementById('modal')?.classList.add('open'),1)
        return(
            
            <div className='modal_holder'>
                        <div id="modal" className='TimeDateModal'>
                            <div className='modal_head'>
                                Update Meta Data
                                <div className='modal_current_date'>
                                    The image you have uploaded has its own location or date attached. Do you want to update the existing data?
                                </div>
                            </div>
    
                            
                            <div className="modal_footer">
                                <div className="modal_button cancel" onClick={()=>props.callbackCancel()}>No</div>
                                <div className="modal_button save" onClick={()=>props.callbackSave()}>Update</div>
                            </div>
    
    
                        </div>
    
    
                    </div>
                
        )
        
    }else{
            document.getElementById('modal')?.classList.remove('open');
            return(<></>)
        }
}

export function ModalInput(props: { label: string, default: number, min: number, max: number, maxLen: number, callback: any }) {
    const [active, setActive] = useState(false);

    function onUpdate(event: ChangeEvent) {
        let value = Number((event.target as HTMLInputElement).value);
        if (value >= props.min && value <= props.max) {
            console.log("in bounds", props.default)
            props.callback(value)
        } else {
            (event.target as HTMLInputElement).value = String(props.default);
        }
        setActive(false)
    }


    return (
        <div className='modal_inner'>
            <div className="modal_input ">
                <label className={!active ? 'modal_input_inner ' : 'modal_input_inner active'}>
                    <span className={!active ? 'modal_input_header' : 'modal_input_header active'}>
                        {props.label}
                    </span>
                    <input type='text' pattern="\d*" maxLength={props.maxLen} className='modal_input_input'
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

export {ModalDateTime,ModalMetaData};