import {Order} from "../../types/Order";
import {SortableColumn} from "../../../Nalezy/hooks/useSorting";

const sort = (ordering: Order[], column: SortableColumn): Order[] => {
    const exists = ordering.find(o => o.column === column);
    if (exists) {
        const filtered = [...ordering.filter(o => o.column !== column)];
        if (exists.direction === 'ASC') {
            return [...filtered, { column: column, direction: 'DESC' }];
        }

        return filtered;
    }

    return [...ordering, { column: column, direction: 'ASC' }];
};

export default sort;
