import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames/bind';

let Header = ({connected}) => (
    <h1>EOS Emulator | {' '}
        <span id="connected" className={classNames({'connected' : connected})}>
            connected
        </span>
    </h1>
);

const mapStateToProps = (state) => {
    return {
        connected: state.connected
    }
};

Header = connect(mapStateToProps)(Header);

export default Header