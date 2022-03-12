import { FC, InputHTMLAttributes, useState } from 'react';
import { default as MInput } from '@mui/material/TextField';
import styled from '@emotion/styled';
import DateAdapter from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';


interface Props extends InputHTMLAttributes<HTMLInputElement> {
    name?: string;
    label?: string;
    error?: string | undefined;
    fullWidth?: boolean;
    className?: string;
    width?: string;
    undertext?: string;
}

const Container = styled.div`
    width: 100%;
    position: relative;
    border-radius: 90px;
    position: relative;
    width: 90px;

`;

const DateTimeUndertext = styled.label`
    position: absolute;
    color: #898A8D;
    margin-left: -25px;
    width: 50px;
    left: 50%;
    bottom: -5px;
    font-size: 9px;
    background: #fff;
    text-align: center;
`;


const DateInput: FC<Props> = props => {
    const { type: propType, className, undertext } = props;

    const [date, setDate] = useState(new Date('2014-08-18T21:11:54'));

    const handleDateChange = (newDate: any) => {
        console.log('cau', newDate)
        setDate(newDate)
    }
    return (
        <Container className={className}>
            <LocalizationProvider dateAdapter={DateAdapter}>
                <MobileDatePicker
                    label={props.label}
                    inputFormat="DD/MM/YY"
                    value={date}
                    onChange={handleDateChange}

                    renderInput={(params) => 
                        <MInput
                            {...params}
                            inputProps={{
                                style: {
                                    padding: '7px 6px',
                                    fontSize: '14px',
                                    textAlign: 'center'
                                },
                                ...params.inputProps
                            }}
                            InputProps={{
                                style: {
                                    width: '100%',
                                    borderRadius: '60px',
                                },
                                ...params.InputProps
                            }}
                            InputLabelProps={{
                                shrink: true,
                                style: {
                                    color: '#898A8D'
                                },
                                ...params.InputLabelProps
                            }}
                        />
                    } 
                />
            </LocalizationProvider>
            <DateTimeUndertext> {undertext} </DateTimeUndertext>
        </Container>
    );
};

export default DateInput;
