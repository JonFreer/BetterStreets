import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'
class NavBar extends React.Component<{}, {}> {

render(){
    return(<div className='navBar'>
        <Link className='navBar_title' to="/">
        BadlyParked
        </Link>

        {/* <button className='navBar_button'> */}
            <Link className='navBar_submit' to="/submit">
                Submit
            </Link>
        
        {/* </button> */}
    </div>)
}
}

export default NavBar;