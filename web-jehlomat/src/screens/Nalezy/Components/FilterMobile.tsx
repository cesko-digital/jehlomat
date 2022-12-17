import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from '@mui/material';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import { white } from 'utils/colors';
import FilterByLocation from './FilterByLocation';
import FilterByRange from './FilterByRange';
import FilterByReporter from './FilterByReporter';
import FilterByState from './FilterByState';

const Backdrop = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 7em 2em;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
`;

const Wrapper = styled.div`
    background: ${white};
    width: 100%;
    height: 100%;
    border: 1px solid #d9d9d9;
    border-radius: 20px;
    overflow: hidden;
`;

const Content = styled.div`
    padding: 1em;
    background: rgba(47, 166, 154, 0.1);
    min-height: 100%;
    max-height: 100%;
    overflow: auto;

    > div {
        margin-bottom: 2em;
    }
`;

const Heading = styled.p`
    color: #808285;
    font-size: 18px;
    text-align: center;
    margin: 0 0 1rem;
    position: relative;
`;

const CloseButton = styled(IconButton)`
    position: absolute;
    top: 0;
    right: 0;
    padding: 0;

    :hover {
        cursor: pointer;
    }
`;

interface FilterMobileProps {
    onClose: () => void;
}

const FilterMobile: React.FC<FilterMobileProps> = ({ onClose }) => (
    <Backdrop>
        <Wrapper>
            <Content>
                <Heading>
                    Filtrovat
                    <CloseButton onClick={onClose} aria-label="Zpět">
                        <CloseIcon sx={{ color: '#808285' }} />
                    </CloseButton>
                </Heading>
                <FilterByLocation />
                <FilterByRange />
                <FilterByReporter />
                <FilterByState />
                <Box display="flex" alignItems="center" flexDirection="column" py={2}>
                    <PrimaryButton text="Použít" onClick={onClose} />
                </Box>
            </Content>
        </Wrapper>
    </Backdrop>
);

export default FilterMobile;
