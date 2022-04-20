import React, { FunctionComponent } from 'react';
import Loading from './Loading';

const LoadingState: FunctionComponent = () => (
    <tr>
        <td colSpan={8}>
            <Loading />
        </td>
    </tr>
);

export default LoadingState;
