import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import './tag.css';
interface TagsState{
    tags:any;
}

export class Tags extends React.Component<{}, TagsState> {

    constructor(props: any) {
        super(props);
        this.state = {tags:{
            "Pavement parking":false,
            "Cyclelane":false,
            "Dropped curb":false,
            "Double Yellow":false,
            "YPLAC":false,
        }}
    }

    render() {
        
        let tags: any[] = [];
        for(let i in this.state.tags){
            // this.state.tags[i]= !this.state.tags[i]
            tags.push(<div className={!this.state.tags[i]?"tag":"tag active"} 
            onClick={ ()=>{
                this.state.tags[i] = !this.state.tags[i]
                this.setState({tags:this.state.tags})}
        
        }
            >{i}</div>)
        }

        return(
            <div>
            <div className='tag_header'>Tags</div>
        <div className="tag_holder">
            
            {tags}
        </div>
        </div>)
    }
}