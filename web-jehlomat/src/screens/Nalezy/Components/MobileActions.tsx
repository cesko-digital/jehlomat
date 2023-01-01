import styled from '@emotion/styled';
import { useHistory } from 'react-router';
import RoundButton from 'Components/Buttons/RoundButton/RoundButton';
import filterIcon from 'assets/icons/filter.svg';
import downloadIcon from 'assets/icons/download.svg';
import markerIcon from 'assets/icons/markerIcon.svg';
import { Box } from '@mui/material';

const ActionButtonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #898a8d;

    p {
        font-size: 0.75rem;
        margin: 0.5rem 0 0;
    }
`;

interface MobileActionsProps {
    onFilter: () => void;
    onExport: () => void;
}

const MobileActions: React.FC<MobileActionsProps> = ({ onFilter, onExport }) => {
    const history = useHistory();

    return (
        <Box mt={2} mb={2} display="flex" flexDirection="row" alignItems="center" justifyContent="space-around">
            <ActionButtonWrapper>
                <RoundButton onClick={onFilter}>
                    <img src={filterIcon} alt="filtrovat" />
                </RoundButton>
                <p>Filtrovat</p>
            </ActionButtonWrapper>
            <ActionButtonWrapper>
                <RoundButton onClick={onExport}>
                    <img src={downloadIcon} alt="stáhnout" />
                </RoundButton>
                <p>Stáhnout</p>
            </ActionButtonWrapper>
            <ActionButtonWrapper>
                <RoundButton onClick={() => history.push('/nalezy/mapa')}>
                    <img src={markerIcon} alt="zobrazit v mapě" />
                </RoundButton>
                <p>Zobrazit v mapě</p>
            </ActionButtonWrapper>
        </Box>
    );
};

export default MobileActions;
