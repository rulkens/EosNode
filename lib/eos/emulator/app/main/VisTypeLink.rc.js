import React from 'react'
import { connect } from 'react-redux'
import {updateVisType} from './actions.redux'
import Link from './Link.rc'

const mapStateToProps = (state, ownProps) => {
    return {
        active: ownProps.visType === state.visType
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch(updateVisType(ownProps.visType))
        }
    }
}

const VisTypeLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(Link);

export default VisTypeLink