

import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import ImageUploading from 'react-images-uploading';
import { ModalDateTime, ModalMetaData } from './modal';
import { ExifParserFactory } from "ts-exif-parser";
import exifr from 'exifr'
import './form.css'
import { AiOutlineEdit } from 'react-icons/ai';
import MyMap from './map'
import { isConstructorDeclaration } from 'typescript';
import { Tags } from './tags'
//AiOutlineEdit
interface FormState {
    image: undefined | string;
    date: Date;
    dateModalActive: boolean;
    metadataModalActive: boolean;
    lat: number;
    lon: number;
    defaults: boolean; //are all the values their default value: used to check for update meta data pop up
    metaData: any;
}

class Form extends React.Component<{}, FormState> {

    constructor(props: any) {
        super(props);
        this.state = {
            image: undefined,
            date: new Date(),
            dateModalActive: false,
            metadataModalActive: false,
            lat: 0,
            lon: 0,
            defaults: true,
            metaData: undefined
        };

        // if we are using arrow function binding in not required
        //  this.onImageChange = this.onImageChange.bind(this);
    }



    onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            console.log(img)
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
            this.setState({ lat: output.latitude, lon: output.longitude, defaults: false })
            console.log("updated location", output.latitude, output.longitude)
        }

        if (output.DateTimeOriginal != undefined) {
            this.setState({ date: output.DateTimeOriginal, defaults: false })
        }
    }

    render() {
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
                            <MyMap markerLat={this.state.lat} markerLon={this.state.lon}></MyMap>

                            <Tags></Tags>
                        </>


                            : <> <div>
                                    Upload your image. Tell us where and when it was taken. Submit! <br/> <br/> Its that simple 🥳
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