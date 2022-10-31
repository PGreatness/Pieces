import React from 'react';
import './css/navbar.css';
import NavbarAppOptions from './NavbarAppOptions';

export default function Navbar(props) {
    // navbar using material ui
    return (
        <div className='navbar'>
            <NavbarAppOptions changeLoc={props.changeLoc}/>
        </div>
    )
}