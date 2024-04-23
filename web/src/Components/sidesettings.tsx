import { IoCloseSharp } from 'react-icons/io5';
import styles from '../css/settings.module.css';
import {AiOutlineCloseCircle} from 'react-icons/ai'
function SideBarSettings(props: { open:boolean, closeCallback:any, settings:any, updateCallback:any, data:any}) {
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

    let wards = {}

    props.data.forEach((crossing)=>{
        if(crossing.ward in wards){
            wards[crossing.ward].total=wards[crossing.ward].total+1
            if(crossing.state ==2){
                wards[crossing.ward].complete=wards[crossing.ward].complete+1
            }   
        }else{
            wards[crossing.ward]={total:0,complete:0}
        }
    }); 

    var items = Object.keys(wards).map(
        (key) => { return [key, wards[key]] });

    items.sort(
        (first, second) => { return second[1].total - first[1].total }
        );

    var keys = items.map(
            (e) => { return e[0] });
    
    let wards_divs =  []

    for (var i in keys){
        wards_divs.push(<div className={styles.ward_holder}> {keys[i]} <span className={styles.ward_number}>{wards[keys[i]].complete}/{wards[keys[i]].total}</span> </div>)
    }

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
        <div className={styles.sidebar_title}>Wards </div>
        {wards_divs}
        <button onClick={()=>props.closeCallback()} className={styles.close}><IoCloseSharp /></button>


    </div>)

}

export default SideBarSettings;

