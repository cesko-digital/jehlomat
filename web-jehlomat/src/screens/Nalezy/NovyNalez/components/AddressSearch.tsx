import React, { useCallback } from 'react';
import { Formik } from 'formik';
import axios  from 'axios';
import styled from '@emotion/styled';
import TextInput from 'Components/Inputs/TextInput/TextInput';
import { Address } from 'screens/Nalezy/NovyNalez/components/types';

interface AddressSearchProps {}

const StyledForm = styled.form`
    position: relative;
    z-index: 100;
`;

const RESULT_LIMIT = 10;

export const AddressSearch: React.FC<AddressSearchProps> = props => {
//    const [lastSearch, setLastSearch] = useState<Dayjs>();

    const handleSubmit = useCallback(async values => {
        const { search } = values;
        console.log('called onsubmit', { search });
        if (!search) return;

        const geoCode = await axios.get<Address>(`https://nominatim.openstreetmap.org/?addressdetails=1&q=${encodeURIComponent(search)}&format=json&limit=${RESULT_LIMIT}`);
    }, []);

    return (
        <>
            <Formik initialValues={{ search: '' }} onSubmit={handleSubmit}>
                {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid }) => (
                    <StyledForm onSubmit={handleSubmit}>
                        <TextInput name="search" placeholder="Fousková 10/1, Kočičí" onChange={handleChange} onBlur={handleBlur} value={values.search} required={true} />
                    </StyledForm>
                )}
            </Formik>
        </>
    );
};

export default AddressSearch;
