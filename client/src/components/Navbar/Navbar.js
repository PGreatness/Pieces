import React from 'react';
import './../css/navbar.css';
import NavbarAppOptions from './Navbar/NavbarAppOptions';

export default function Navbar() {
    // navbar using material ui
    return (
        <div className='navbar'>
            <NavbarAppOptions/>
        </div>
    )
}