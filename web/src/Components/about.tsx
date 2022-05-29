import styles from '../css/about.module.css';

function About(){

    return(<div><h1 className={styles.about_title}>BadlyParked</h1>
        <h2 className={styles.about_subtitle}>Open Source Data Collection For Evidence Backed Change</h2>
        <div className={styles.about_box_holder}>
            <div className ={styles.about_box}>
                <a className={styles.about_box_a} href={"/api/docs"}>
                    <div>
                    <h3 className={styles.about_box_heading}>
                        API
                    </h3>
                    <p className={styles.about_box_paragraph} > 
                All of the data that we collect is publically accessable! It can be easily accessed through our API. Click here to visit the documentation.
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