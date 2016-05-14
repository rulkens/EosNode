import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames/bind';

let Leds = ({leds, visType, direction}) => (
    <div className={classNames(
            'leds',
            {[`vis-type-${visType}`]: true},
            {[`direction-${direction}`]: true})
        }>
        {leds.map((led, index) => {
            let color = 'rgb(' + led.join(',') + ')';
            let style =
                    visType === 'fancy'
                        ? {backgroundImage : 'radial-gradient(ellipse farthest-side, ' + color + ', rgba(0,0,0,0)'}
                        : {backgroundColor : color};
            return <div className="led-item" style={style} key={index}></div>
        })}
    </div>
);

const mapStateToProps = (state) => {
    return {
        leds: state.leds,
        visType : state.visType,
        direction: state.direction
    }
}

Leds = connect(mapStateToProps)(Leds);

export default Leds;