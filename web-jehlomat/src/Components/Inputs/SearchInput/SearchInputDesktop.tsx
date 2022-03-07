import { FC, InputHTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { primaryDark, greyLight } from '../../../utils/colors';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fontFamilyRoboto } from '../../../utils/typography';

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const Layout = styled.div`
    display: inline-block;
    position: relative;
    height: 36px;
    max-width: 340px;
`;

const IconWrapper = styled.label`
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: ${primaryDark};
`;

const Input = styled.input`
    height: 36px;
    width: 100%;
    padding: 0px 16px;
    border: 1px solid ${primaryDark};
    box-sizing: border-box;
    border-radius: 28px;
    &::placeholder {
        ${fontFamilyRoboto};
        color: ${greyLight};
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 16px;
        text-align: left;
        letter-spacing: 1.25px;
    }
`;

const SearchInputMobile: FC<Props> = props => {
    return (
        <Layout>
            <Input {...props} />
            <IconWrapper>
                <FontAwesomeIcon icon={faSearch} />
            </IconWrapper>
        </Layout>
    );
};

export default SearchInputMobile;
