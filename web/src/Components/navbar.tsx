import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'
import {IoMdAddCircle} from 'react-icons/io'
class NavBar extends React.Component<{}, {}> {

render(){
    return(<div className='navBar'>
        <Link className='navBar_title' to="/">
        BetterStreets

        <div className="navBar_beta">Beta2</div>
        </Link>

        {/* <button className='navBar_button'> */}

            {/* <Link className='navBar_link' to="/about">
                About
            </Link> */}
        
            {/* <Link className='navBar_submit' to="/submit">
                <IoMdAddCircle className={"navBar_icon"}></IoMdAddCircle>Contribute
            </Link> */}
        
        {/* </button> */}
    </div>)
}
}

export default NavBar;