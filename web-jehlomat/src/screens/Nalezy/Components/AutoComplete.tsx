import React, { FC, FunctionComponent } from 'react';
import { styled } from '@mui/system';
import ControlWrapper from 'screens/Nalezy/Components/ControlWrapper';
import { Autocomplete, AutocompleteProps, TextField } from '@mui/material';
import { Input } from './Input';
import { Location } from './utils/loadLocations';

const AutoComplete: React.FC<any> = ({ options, ...rest }) => (
    <Autocomplete
        options={options}
        freeSolo
        renderInput={params => <TextField {...params} />}
    />
);

export default AutoComplete;
