import React from 'react'
import { connect } from 'react-redux'
import {updateDirection} from './actions.redux'
import Link from './Link.rc'

const mapStateToProps = (state, ownProps) => {
    return {
        active: ownProps.direction === state.direction
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch(updateDirection(ownProps.direction))
        }
    }
}

const DirectionLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(Link);

export default DirectionLink