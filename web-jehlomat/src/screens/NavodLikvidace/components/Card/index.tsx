import Box from '@mui/material/Box';
import CardTitle from '../CardTitle';
import NumberIcon from '../NumberIcon';
import { ICard } from './types';

const Card: React.FC<ICard> = ({ number, backgroundColor, title, children }) => {
    return (
        <Box bgcolor={backgroundColor} width={1}>
            <Box
                maxWidth={688}
                gap={[0, 5]}
                display="flex"
                p={[2, 2, 6]}
                px={[2, 2, 7]}
                flexDirection={['column', 'row']}
                width={['auto', 'calc(100% - 30px)']}
                alignItems="center"
                margin="auto"
                pb={2}
            >
                <NumberIcon number={number} />
                <div>
                    <Box mt={['10px', 0, 0]}>
                        <CardTitle text={title} />
                    </Box>
                    <Box sx={{ mt: '4px' }}>{children}</Box>
                </div>
            </Box>
        </Box>
    );
};

export default Card;
