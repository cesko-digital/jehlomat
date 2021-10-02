import { FC, InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import { primaryDark, primaryLight } from '../../Utils/Colors';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface SearchInput extends InputHTMLAttributes<HTMLInputElement> {}

const Layout = styled.div`
    width: 100%;
    position: relative;
`;

const IconWrapper = styled.label`
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);

    color: ${primaryDark};
`;

const Input = styled.input`
    height: 32px;
    width: 100%;
    max-width: 340px;
    padding: 0px 32px;

    border: 1px solid ${primaryLight};
    box-sizing: border-box;
    border-radius: 28px;

    :focus {
        outline: none;
    }
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
