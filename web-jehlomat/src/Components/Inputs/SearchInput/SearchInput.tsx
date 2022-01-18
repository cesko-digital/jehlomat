import { FC, InputHTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { primaryDark, primaryLight } from '../../../utils/colors';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface SearchInput extends InputHTMLAttributes<HTMLInputElement> {}

const Layout = styled.div`
    position: relative;
    max-width: 340px;
    width: 100%;
`;

const IconWrapper = styled.label`
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);

    color: ${primaryDark};
`;

const Input = styled.input`
    height: 36px;
    width: 100%;
    padding: 0px 32px;

    border: 1px solid ${primaryLight};
    box-sizing: border-box;
    border-radius: 28px;
`;

const SearchInput: FC<SearchInput> = props => {
    return (
        <Layout>
            <IconWrapper>
                <FontAwesomeIcon icon={faSearch} />
            </IconWrapper>
            <Input {...props} />
        </Layout>
    );
};

export default SearchInput;
