import styles from '../css/about.module.css';

function About(){

    return(<div><h1 className={styles.about_title}>BetterStreets</h1>
        <h2 className={styles.about_subtitle}>Open Source Data Collection For Evidence Backed Change</h2>
        <div className={styles.about_box_holder}>

             <div className ={styles.about_box}>
                <a className={styles.about_box_a}>
                    <div>
                    <h3 className={styles.about_box_heading}>
                        <div className={styles.beta}>Beta</div>
                    </h3>
                    <p className={styles.about_box_paragraph} > 
                This site is still under very heavy development: many aspects may change, data may be lost, features may be missing.
                 Despite this we appreciate any use of this site during these early days and if you have any problems please feel free to reach out. 
              </p>
              </div>
            
                </a>    
            </div>   

            <div className ={styles.about_box}>
                <a className={styles.about_box_a} href={"/api/docs"}>
                    <div>
                    <h3 className={styles.about_box_heading}>
                        API
                    </h3>
                    <p className={styles.about_box_paragraph} > 
                All of the data that we collect is publically accessible! It can be easily accessed through our API. Click here to visit the documentation.
              </p>
              <div className={styles.about_box_button}>Vist API</div>
              </div>
              <img className={styles.about_box_image} src = {process.env.PUBLIC_URL+"/about/api.png"}></img>
                </a>    
            </div>    
            
            <div className ={styles.about_box}>
                <a className={styles.about_box_a} href={"/api/docs"}>
                    <div>
                    <h3 className={styles.about_box_heading}>
                        GITHUB
                    </h3>
                    <p className={styles.about_box_paragraph} > 
                We are completely Open Source!! Feel free to check out the source code or suggest an improvement over on GitHub
              </p>
              <div className={styles.about_box_button}>Vist GitHub</div>
              </div>
              <img className={styles.about_box_image} src = {process.env.PUBLIC_URL+"/about/github.png"}></img>
                </a>    
            </div>    

        </div>
    </div>)
}

export default About;