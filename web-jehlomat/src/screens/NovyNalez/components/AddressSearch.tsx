import React, {useCallback, useState} from 'react';
import { Formik } from 'formik';
import axios, { AxiosResponse } from 'axios';
import styled from '@emotion/styled';
import TextInput from 'Components/Inputs/TextInput/TextInput';
import { Address } from './types';
import {Dayjs} from "dayjs";

interface AddressSearchProps {}

const StyledForm = styled.form`
    position: relative;
    z-index: 100;
`;

export const AddressSearch: React.FC<AddressSearchProps> = props => {
    const [lastSearch, setLastSearch] = useState<Dayjs>();

    const handleSubmit = useCallback(async values => {
        const { search } = values;
        if (!search) return;

        const geoCode = await axios.get<Address>(`https://nominatim.openstreetmap.org/?addressdetails=1&q=${encodeURIComponent(search)}&format=json&limit=1`);

        console.log({geoCode})

    }, []);

    return (
        <>
            <Formik initialValues={{ search: '' }} onSubmit={handleSubmit}>
                {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid }) => (
                    <StyledForm onSubmit={handleSubmit}>
                        <TextInput name="search" placeholder="Fousková 10/1, Kočičí" required={true} />
                    </StyledForm>
                )}
            </Formik>
        </>
    );
};

export default AddressSearch;
