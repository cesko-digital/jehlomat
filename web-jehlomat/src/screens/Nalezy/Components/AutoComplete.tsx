import ControlWrapper from 'screens/Nalezy/Components/ControlWrapper';
import { Autocomplete, TextField } from '@mui/material';
import { Location } from './utils/loadLocations';

const AutoComplete: React.FC<any> = ({ options, ...rest }) => (
    <ControlWrapper style={{ height: 'auto', minHeight: 32 }}>
        <Autocomplete
            options={options}
            sx={{
                border: 'none',
                color: '#000',
                flexGrow: 1,
                lineHeight: 1,
                padding: 0,
                margin: 0,
                width: '100%',

                '&:focus': {
                    outline: 'none',
                },
                '& .MuiAutocomplete-tag': {
                    backgroundColor: 'rgba(47, 166, 154, 0.31)',
                    '& .MuiChip-deleteIcon': {
                        color: '#0E766C',
                    },
                    '& .MuiChip-deleteIcon:hover': {
                        color: 'rgba(0, 0, 0, 0.26)',
                    },
                },
                '& .MuiOutlinedInput-root': {
                    lineHeight: 1,
                    padding: 0,
                    border: 'none',
                    fontSize: '0.85rem',
                    ...(rest.value.length > 0 && { paddingBlock: '6px' }),
                    '& .MuiAutocomplete-input': {
                        padding: 0,
                        color: 'rgba(14, 118, 108, 1)',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                        padding: 0,
                    },
                },
            }}
            renderInput={params => <TextField {...params} />}
            getOptionLabel={(option: Location) => option.name}
            renderOption={(props, option: Location, state) => (
                <li {...props} key={option.id}>
                    {option.name}
                </li>
            )}
            {...rest}
        />
    </ControlWrapper>
);

export default AutoComplete;
