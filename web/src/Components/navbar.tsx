import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'
import {IoMdAddCircle} from 'react-icons/io'
import * as bs4bSvg from '../../public/bs4b.svg';
class NavBar extends React.Component<{}, {}> {

render(){
    return(<div className='navBar'>
        <Link className='navBar_title' to="/">

        <img src={'../../public/bs4b.svg'} alt='mySvgImage' />
        BS4B Crossing Survey

        <div className="navBar_beta">2.0</div>
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