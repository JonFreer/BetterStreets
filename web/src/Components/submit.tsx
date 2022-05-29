import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import { ModalDateTime, ModalMetaData } from './modal';
import exifr from 'exifr'
import './form.css'
import { MapSubmit } from './map';
import { Tags } from './tags'
import { FaSpinner } from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";
import ImageDraw from './imgDraw';
// import { useHistory } from "react-router-dom";
// import {withRouter} from 'react-router';
//AiOutlineEdit
// impo
import { AiOutlineEdit } from 'react-icons/ai';

function Submit() {

    // const history = useHistory();
    const navigate = useNavigate();
    const [image, setImage] = useState<undefined | string>(undefined);
    const [date, setDate] = useState<Date>(new Date());
    const [dateModalActive, setDateModalActive] = useState(false);
    const [metaModalActive, setMetaModalActive] = useState(false);
    const [imageDrawActive, setImageDrawActive] = useState(false);
    const [initLat, setInitLat] = useState(0);
    const [initLon, setInitLon] = useState(0);
    const [lat, setLat] = useState(0);
    const [lon, setLon] = useState(0);
    const [defaults, setDefaults] = useState(true);
    const [metaData, setMetaData] = useState<any>(undefined);
    const [imgFile, setImgFile] = useState<File | null>(null);
    const [imgFileNew, setImgFileNew] = useState<File | null>(null)
    const [uploadState, setUploadState] = useState(0);
    const [rerender, setRerender] = useState(false); //for tag updates
    const [tags, setTags] = useState({
        "Pavement parking": false,
        "Cyclelane": false,
        "Dropped curb": false,
        "Double Yellow": false,
        "YPLAC": false,
    })

    const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setImgFile(img)
            // this.setState({ imgFile: img })
            exifr.parse(img).then(output => {
                console.log('Camera:', output.Make, output.Model, output.DateTimeOriginal)
                setMetaData(output);
                // this.setState({ metaData: output });
                if (defaults) {
                    updateMetaDate(output);
                } else {
                    setMetaModalActive(true)
                    // this.setState({ metadataModalActive: true })
                }
            })
            //   const Data = ExifParserFactory.create(img).parse();
            // console.log(parser.parse())
            setImage(URL.createObjectURL(img));
            setImageDrawActive(true);
            // this.setState({
            //     image: 
            // });



        }
    };

    function updateMetaDate(output: any) {
        if (output.longitude != undefined) {
            setInitLat(output.latitude);
            setInitLon(output.longitude);
            setLat(output.latitude);
            setLon(output.longitude);
            setDefaults(false);
            // this.setState({ initLat: output.latitude, lat: output.latitude, lon: output.longitude, initLon: output.longitude, defaults: false })
        }
        if (output.DateTimeOriginal != undefined) {
            setDate(output.DateTimeOriginal);
            setDefaults(false);
            // this.setState({ date: output.DateTimeOriginal, defaults: false })
        }
    }

    function submit() {
        if (uploadState != 0) {
            return;
        }
        // this.setState({ uploadState: 1 })
        setUploadState(1);
        let formData = new FormData();
        if (imgFile != null && imgFileNew != null) {
            console.log(imgFile)
            // if(image!=undefined){
            // const file = 
            // setImgFile(file);
            // imgFile.
            console.log(imgFileNew)

            formData.append('file', imgFileNew); //was imgFile //new 
            // }
            formData.append("time", String(date.getTime()));
            formData.append("tags", JSON.stringify(tags));
            formData.append("lat", String(lat));
            formData.append("lon", String(lon));

            console.log(formData.get("file"))


            const requestOptions = {
                method: 'POST',
                // headers: { 'Content-Type': 'multipart/form-data' },
                body: formData
            };


            fetch('https://badlyparked.localhost/api/submit', requestOptions)
                .then(response => {
                    console.log(response)
                    if (response.status == 200) {
                        response.json().then((data) => {
                            navigate("/")
                        });
                    } else {
                        setUploadState(0);
                    }


                })

        } else {
            console.error("ImageFile == Null")
        }
    }

    // render() {

    if (imageDrawActive) {
        return (<div>
            {/* <div className='tag_header'>Blur</div> */}
            <br></br>
            <div className='form_text'>Click and Drag to Censor the Image</div>
            
            <br></br>
            <ImageDraw open={imageDrawActive} img={image} callback={(blob: any) => {
                setImage(URL.createObjectURL(blob));
                setImgFileNew(new File([blob], "IMG_20220518_203117.jpg", { type: "image/jpeg", lastModified: new Date().getTime() }));
                setImageDrawActive(false);
            }}></ImageDraw>

        </div>)
    }

    if (image == undefined) {
        return (<div>
            <div>
                <div className="form_holder">
                    <div className="form_title">
                        Contribute Your Image
                    </div>
                    <div className ="form_text">
                    1) Upload your image. <br />2) Tell us where and when it was taken. <br /> 3) Submit! <br /> <br /> It's that simple 🥳
                    </div>
                    <label className="custom-file-upload">
                        <input type="file" onChange={onImageChange} />
                        {image == undefined ? "Upload Image" : "Change Image"}
                    </label>
                </div>
            </div>
        </div>)
    }


    return (
        <div>
            <div>
                <div className="form_holder">

                    {/* <h1>Select Image</h1> */}
                    <label className="custom-file-upload">
                        <input type="file" onChange={onImageChange} />
                        {image == undefined ? "Upload Image" : "Change Image"}
                    </label>

                    <img className="image_holder" src={image} />
                    {image != undefined ? <>
                        <div className='tag_header'>Time and Date</div>
                        <div className="time_holder" onClick={() => { setDateModalActive(true) }}>
                            {date.toLocaleDateString('en-UK', { weekday: 'long' })}, {date.toLocaleDateString('en-UK', { day: '2-digit' })} {date.toLocaleDateString('en-UK', { month: 'long' })} {date.toLocaleDateString('en-UK', { year: 'numeric' })}, {date.toLocaleTimeString('en-UK', { hour: 'numeric', hour12: true }).toLocaleUpperCase()}
                            <AiOutlineEdit className='icon_form'></AiOutlineEdit>
                        </div>
                        <div className='tag_header'>Location</div>
                        <MapSubmit markerLat={initLat}
                            markerLon={initLon}
                            callback={(lat: number, lon: number) => {
                                // this.setState({ lat: lat, lon: lon })
                                setLat(lat);
                                setLon(lon);
                            }}

                        ></MapSubmit>

                        <Tags tags={tags} callback={(val: any) => {
                            tags[val] = !tags[val]
                            setRerender(!rerender);
                            // this.setState({ tags: tags })
                            //icon="spinner" //removed
                        }}></Tags>

                        <label className={uploadState == 0 ? "custom-file-upload" : "custom-file-upload uploading"} onClick={() => submit()}>
                            {uploadState == 0 ? "Submit" : <FaSpinner className="spinner" ></FaSpinner>}
                        </label>
                        
                    </>


                        : <> <div>
                            1) Upload your image. <br />2) Tell us where and when it was taken. <br /> 3) Submit! <br /> <br /> It's that simple 🥳
                        </div></>}



                    {/* <input type="file" name="myImage" /> */}
                </div>
            </div>
            <ModalDateTime open={dateModalActive}
                callbackSave={(val: Date) => {
                    setDate(val);
                    setDateModalActive(false);
                    // this.setState({ date: val, dateModalActive: false }) 
                }}
                callbackCancel={() => {
                    setDateModalActive(false);
                    // this.setState({ dateModalActive: false }) 
                }}></ModalDateTime>



            <ModalMetaData open={metaModalActive}
                callbackSave={() => {
                    setMetaModalActive(false);
                    updateMetaDate(metaData);
                    // this.setState({ metadataModalActive: false })

                }}
                callbackCancel={() => {
                    setMetaModalActive(false);
                    // this.setState({ metadataModalActive: false })

                }}></ModalMetaData>



        </div>




    );
    // }

}


export default Submit;