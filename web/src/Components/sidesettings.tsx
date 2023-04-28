import styles from '../css/settings.module.css';
import {AiOutlineCloseCircle} from 'react-icons/ai'
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

    const updateIncomplete =(()=>{
        const clonedSettings = { ...props.settings };
        clonedSettings.incomplete = !clonedSettings.incomplete;
        props.updateCallback(clonedSettings)
    })

    const updateUnclassified =(()=>{
        const clonedSettings = { ...props.settings };
        clonedSettings.unclassified = !clonedSettings.unclassified;
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
                <label className={styles.sidebar_label} onClick={()=>{updateCompleted()}}>Completed</label>
        </div>
        <div className={styles.sidebar_check} >
                <input type="checkbox" id="scales" name="scales" checked={props.settings.incomplete} onChange={()=>{
                     const clonedSettings = { ...props.settings };
                     clonedSettings.incomplete = !clonedSettings.incomplete;
                     props.updateCallback(clonedSettings)
                    }}/>
                <label className={styles.sidebar_label} onClick={()=>{updateIncomplete()}}>Incomplete</label>
        </div>
        <div className={styles.sidebar_check} >
                <input type="checkbox" id="scales" name="scales" checked={props.settings.unclassified}onChange={()=>{
                     const clonedSettings = { ...props.settings };
                     clonedSettings.unclassified = !clonedSettings.unclassified;
                     props.updateCallback(clonedSettings)
                    }}/>
                <label className={styles.sidebar_label} onClick={()=>{updateUnclassified()}} >Unclassified</label>
        </div>
        <button onClick={()=>{props.closeCallback()}} className={styles.close}><AiOutlineCloseCircle /></button>
    </div>)

}

export default SideBarSettings;

