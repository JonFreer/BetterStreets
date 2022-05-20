import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import './tag.css';
interface TagsState{
    tags:any;
}

export class Tags extends React.Component<{tags:any, callback:any}, TagsState> {

    constructor(props: any) {
        super(props);
        // this.state = {}
    }

    render() {
        
        let tags: any[] = [];
        for(let i in this.props.tags){
            // this.state.tags[i]= !this.state.tags[i]
            tags.push(<div className={!this.props.tags[i]?"tag":"tag active"} 
            onClick={ ()=>{
                this.props.callback(i)

            }
        
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