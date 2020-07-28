import './Header.css';
import React from 'react';

export default function Header(props) {
    return (
        <div className="header">
            <div className="header__title">{props.text}</div>
            {props.children}
        </div>
    )
} 