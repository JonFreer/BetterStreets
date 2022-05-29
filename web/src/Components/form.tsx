import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import { ModalDateTime, ModalMetaData } from './modal';
import exifr from 'exifr'
import './form.css'
import { AiOutlineEdit } from 'react-icons/ai';
import MyMap from './map'
import { Tags } from './tags'
import { FaSpinner } from 'react-icons/fa';
// import {withRouter} from 'react-router';
//AiOutlineEdit
interface FormState {
    image: undefined | string;
    date: Date;
    dateModalActive: boolean;
    metadataModalActive: boolean;
    initLat: number;
    initLon: number;
    lat: number;
    lon: number;
    defaults: boolean; //are all the values their default value: used to check for update meta data pop up
    metaData: any;
    imgFile: File | null;
    tags: any;
    uploadState: number; //0 pre, 1 uploading, 2// success
}

class Form extends React.Component<{}, FormState> {

    constructor(props: any) {
        super(props);
        this.state = {
            image: undefined,
            date: new Date(),
            dateModalActive: false,
            metadataModalActive: false,
            initLat: 0,
            initLon: 0,
            lat: 0,
            lon: 0,
            defaults: true,
            metaData: undefined,
            imgFile: null,
            uploadState: 0,
            tags: {
                "Pavement parking": false,
                "Cyclelane": false,
                "Dropped curb": false,
                "Double Yellow": false,
                "YPLAC": false,
            }
        };

        // if we are using arrow function binding in not required
        //  this.onImageChange = this.onImageChange.bind(this);
    }



    onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            this.setState({ imgFile: img })
            exifr.parse(img).then(output => {
                console.log('Camera:', output.Make, output.Model, output.DateTimeOriginal)
                this.setState({ metaData: output });
                if (this.state.defaults) {
                    this.updateMetaDate(output);
                } else {
                    this.setState({ metadataModalActive: true })
                }
            })
            //   const Data = ExifParserFactory.create(img).parse();
            // console.log(parser.parse())
            this.setState({
                image: URL.createObjectURL(img)
            });



        }
    };

    updateMetaDate(output: any) {
        if (output.longitude != undefined) {
            this.setState({ initLat: output.latitude, lat: output.latitude, lon: output.longitude, initLon: output.longitude, defaults: false })
        }
        if (output.DateTimeOriginal != undefined) {
            this.setState({ date: output.DateTimeOriginal, defaults: false })
        }
    }

    submit() {
        if (this.state.uploadState != 0) {
            return;
        }
        this.setState({ uploadState: 1 })
        let formData = new FormData();
        if (this.state.imgFile != null) {
            console.log(this.state.imgFile)
            formData.append('file', this.state.imgFile);
            formData.append("time", String(this.state.date.getTime()));
            formData.append("tags", JSON.stringify(this.state.tags));
            formData.append("lat", String(this.state.lat));
            formData.append("lon", String(this.state.lon));

            const requestOptions = {
                method: 'POST',
                // headers: { 'Content-Type': 'multipart/form-data' },
                body: formData
            };


            fetch('https://api.badlyparked.localhost/submit', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    if (data == 'Success') {
                        this.setState({ uploadState: 2 });
                    } else {
                        console.error("Upload error: ", data)
                        this.props.history.push('/');
                        this.setState({ uploadState: 0 });
                    }
                });
        } else {
            console.error("ImageFile == Null")
        }
    }

    render() {

        if (this.state.uploadState == 2) {
            return (
            <div>
                <div>
                    <div className="form_holder">
                        Upload!
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
                            <input type="file" onChange={this.onImageChange} />
                            {this.state.image == undefined ? "Upload Image" : "Change Image"}
                        </label>

                        <img className="image_holder" src={this.state.image} />
                        {this.state.image != undefined ? <>
                            <div className='tag_header'>Time and Date</div>
                            <div className="time_holder" onClick={() => { this.setState({ dateModalActive: true }) }}>
                                {this.state.date.toLocaleDateString('en-UK', { weekday: 'long' })}, {this.state.date.toLocaleDateString('en-UK', { day: '2-digit' })} {this.state.date.toLocaleDateString('en-UK', { month: 'long' })} {this.state.date.toLocaleDateString('en-UK', { year: 'numeric' })}, {this.state.date.toLocaleTimeString('en-UK', { hour: 'numeric', hour12: true }).toLocaleUpperCase()}
                                <AiOutlineEdit className='icon_form'></AiOutlineEdit>
                            </div>
                            <div className='tag_header'>Location</div>
                            <MyMap markerLat={this.state.initLat}
                                markerLon={this.state.initLon}
                                callback={(lat: number, lon: number) => { this.setState({ lat: lat, lon: lon }) }}

                            ></MyMap>

                            <Tags tags={this.state.tags} callback={(val: any) => {
                                this.state.tags[val] = !this.state.tags[val]
                                this.setState({ tags: this.state.tags })
                            }}></Tags>

                            <label className={this.state.uploadState == 0 ? "custom-file-upload" : "custom-file-upload uploading"} onClick={() => this.submit()}>
                                {this.state.uploadState == 0 ? "Submit" : <FaSpinner icon="spinner" className="spinner" ></FaSpinner>}
                            </label>

                        </>


                            : <> <div>
                                1) Upload your image. <br />2) Tell us where and when it was taken. <br /> 3) Submit! <br /> <br /> It's that simple 🥳
                            </div></>}



                        {/* <input type="file" name="myImage" /> */}
                    </div>
                </div>
                <ModalDateTime open={this.state.dateModalActive}
                    callbackSave={(val: Date) => { this.setState({ date: val, dateModalActive: false }) }}
                    callbackCancel={() => { this.setState({ dateModalActive: false }) }}></ModalDateTime>

                <ModalMetaData open={this.state.metadataModalActive}
                    callbackSave={() => {
                        this.setState({ metadataModalActive: false })
                        this.updateMetaDate(this.state.metaData);
                    }}
                    callbackCancel={() => {
                        this.setState({ metadataModalActive: false })

                    }}></ModalMetaData>



            </div>




        );
    }

}


export default Form;