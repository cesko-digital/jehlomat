import { ICard } from './types';
import Box from '@mui/material/Box';
import NumberIcon from '../NumberIcon';
import CardTitle from '../CardTitle';

const Card: React.FunctionComponent<ICard> = ({ number, backgroundColor, title, children }) => {
    return (
        <Box sx={{ backgroundColor: backgroundColor, width: '100%' }}>
            <Box
                sx={{
                    padding: '16px',
                    paddingBottom: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '360px',
                    boxSizing: 'border-box',
                    margin: 'auto',
                }}
            >
                <NumberIcon number={number} />
                <Box sx={{ mt: '10px' }}>
                    <CardTitle text={title} />
                </Box>
                <Box sx={{ mt: '4px' }}>{children}</Box>
            </Box>
        </Box>
    );
};

export default Card;
