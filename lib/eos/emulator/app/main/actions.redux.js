/**
 * Created by rulkens on 05/05/16.
 */
export const updateLeds = (leds) => {
    return {
        type : 'LEDS_UPDATE',
        leds
    }
};

export const updateVisType = (visType) => {
    return {
        type: 'VIS_TYPE_UPDATE',
        visType
    }
};

export const updateDirection = (direction) => {
    return {
        type: 'DIRECTION_UPDATE',
        direction
    }
};

export const connect = () => {
    return {
        type : 'CONNECT'
    }
};

export const disconnect = () => {
    return {
        type : 'DISCONNECT'
    }
};