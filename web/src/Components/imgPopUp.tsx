import styles from '../css/imgpopup.module.css';
import {BsFlagFill} from 'react-icons/bs'
function ImgPopUp(props:{id:string, closeCallback:any}) {
    

    return (<div className={styles.background} onClick={props.closeCallback}>
            <div className={styles.holder}>

                <img className ={styles.img} src={"/api/img/"+props.id+".WebP"}></img>
                <div className= {styles.date}>12th May 2022</div>
                <div className = {styles.report}><BsFlagFill className = {styles.icon}></BsFlagFill></div>
            </div>
         </div>)
}

export default ImgPopUp;