import React from 'react'
import moment from 'moment';

const DateRender = ({ val }) => {
    return (
        <span>{moment(val).format('DD-MM-YYYY h:mm:ss a')}</span>
    )
}

export default DateRender;
