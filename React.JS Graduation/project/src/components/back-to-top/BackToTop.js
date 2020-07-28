import './BackToTop.css';
import React from 'react';
import { IconButton, Slide, Tooltip } from '@material-ui/core';
import { ExpandLess } from '@material-ui/icons';

export default function BackToTop(props) {
    const [scrollEnable, setScrollEnable] = React.useState(false);
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 900) {
            setScrollEnable(true);
        } else {
            setScrollEnable(false);
        };
    })
    return (
        <Slide in={scrollEnable} direction='up'>
            <div className='scroller'>
                <Tooltip title="Scroll to top" placement="bottom">
                    <IconButton
                        color="primary"
                        aria-label="scroll to top"
                        onClick={() => {
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            })
                        }}>
                        <ExpandLess fontSize='large' />
                    </IconButton>
                </Tooltip>
            </div>
        </Slide>
    )
}