import React, { useContext } from 'react';

import { LoadingContext } from './LoadingContext';
import { ButtonContext } from './ButtonContext';

export const withHocks = (Component) => {
    return (props) => {
        const { isLoading, dispatchLoading } = useContext(LoadingContext);
        const { dataButtonList:state, dispatch } = useContext(ButtonContext);

        return (
            <Component
                {...props}
                buttonHeader={{ dataButtonList:state, dispatch }}
                loadingParam={{ isLoading, dispatchLoading }}
            />
        )
    };
}
