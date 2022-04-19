import { styled } from '@mui/system';
import { SortDirection } from 'screens/Nalezy/types/SortDirection';
import Heading from 'screens/Nalezy/Components/Heading';

interface SortableHeadingProps {
    direction?: SortDirection;
}

const SortableHeading = styled(Heading, {
    shouldForwardProp: prop => prop !== 'direction',
})<SortableHeadingProps>(props => ({
    cursor: 'pointer',
    userSelect: 'none',

    '&:after': {
        content: "''",
        display: 'inline-block',
        width: 6,
        height: 14,
        position: 'relative',
        top: 4,
        left: 4,
        backgroundImage: `url('data:image/svg+xml;base64,${order(props)}')`,
        backgroundRepeat: 'no-repeat',
    },
}));

const order = (props: SortableHeadingProps) => {
    if (props.direction === 'ASC') {
        return 'PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSIxMyIgdmlld0JveD0iMCAwIDYgMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zIDBMNS41OTgwOCA0LjVIMC40MDE5MjRMMyAwWiIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPHBhdGggZD0iTTMgMTNMMC40MDE5MjQgOC41SDUuNTk4MDhMMyAxM1oiIGZpbGw9IiMwRTc2NkMiLz4KPC9zdmc+';
    }

    if (props.direction === 'DESC') {
        return 'PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSIxMyIgdmlld0JveD0iMCAwIDYgMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zIDBMNS41OTgwOCA0LjVIMC40MDE5MjRMMyAwWiIgZmlsbD0iIzBFNzY2QyIvPgo8cGF0aCBkPSJNMyAxM0wwLjQwMTkyNCA4LjVINS41OTgwOEwzIDEzWiIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPC9zdmc+';
    }

    return 'PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSIxMyIgdmlld0JveD0iMCAwIDYgMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zIDBMNS41OTgwOCA0LjVIMC40MDE5MjRMMyAwWiIgZmlsbD0iIzBFNzY2QyIvPgo8cGF0aCBkPSJNMyAxM0wwLjQwMTkyNCA4LjVINS41OTgwOEwzIDEzWiIgZmlsbD0iIzBFNzY2QyIvPgo8L3N2Zz4=';
};

export default SortableHeading;
