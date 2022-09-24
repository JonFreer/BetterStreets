import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import styles from '../css/settings.module.css';
import {GrClose} from "react-icons/gr"
import {GiHamburgerMenu} from 'react-icons/gi'
function SideBarSettings(props: { open:boolean, closeCallback:any, settings:any, updateCallback:any}) {
    if(!props.open){
        document.getElementById('settings')?.classList.remove(styles.open);
    }else{
        document.getElementById('settings')?.classList.add(styles.open);
    }

    // const [settings, setSettings] = useState({
    //     "completed":true,
    //     "incomplete":true,
    //     "unclassified":true
    //   });

    // useEffect(() => {
    //     setSettings(props.settings);
    //   }, [props.settings]);


    
    const updateCompleted =(()=>{
        const clonedSettings = { ...props.settings };
        clonedSettings.completed = !clonedSettings.completed;
        props.updateCallback(clonedSettings)
    })  

    return(<div id="settings" className={styles.sidebar}>
        <div className={styles.sidebar_title}>Filter</div>
        <div className={styles.sidebar_check} >    
                <input type="checkbox" id="scales" name="scales" checked={props.settings.completed} onChange={()=>{
                     const clonedSettings = { ...props.settings };
                     clonedSettings.completed = !clonedSettings.completed;
                     props.updateCallback(clonedSettings)
                    }
                    }/>
                <label className={styles.sidebar_label}>Completed</label>
        </div>
        <div className={styles.sidebar_check} >    
                <input type="checkbox" id="scales" name="scales" checked={props.settings.incomplete} onChange={()=>{
                     const clonedSettings = { ...props.settings };
                     clonedSettings.incomplete = !clonedSettings.incomplete;
                     props.updateCallback(clonedSettings)
                    }}/>
                <label className={styles.sidebar_label}>Incomplete</label>
        </div>
        <div className={styles.sidebar_check} >    
                <input type="checkbox" id="scales" name="scales" checked={props.settings.unclassified}onChange={()=>{
                     const clonedSettings = { ...props.settings };
                     clonedSettings.unclassified = !clonedSettings.unclassified;
                     props.updateCallback(clonedSettings)
                    }}/>
                <label className={styles.sidebar_label} >Unclassified</label>
        </div>

        <button onClick={()=>{props.closeCallback()}} className={styles.close}><GiHamburgerMenu></GiHamburgerMenu></button>
    </div>)

}

export default SideBarSettings;

