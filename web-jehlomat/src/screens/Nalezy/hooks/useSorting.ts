import {useState} from "react";

export type SortableColumn = 'TOWN' | 'CREATED_AT' | 'CREATED_BY' | 'DEMOLISHED_AT';

export interface Order {
  column: SortableColumn;
  direction: 'ASC' | 'DESC';
}

const useSorting = () => {
  const [order, setOrder] = useState<Array<Order>>([]);

  const direction = (column: SortableColumn): 'ASC' | 'DESC' | undefined => {
    const current = order.find(o => o.column === column);
    if (!current) return undefined;

    return current.direction;
  };

  const handleSort = (column: SortableColumn) => () => {
    // Order by order: void -> ASC -> DESC -> void
    setOrder(state => {
      const exists = state.find(o => o.column === column);
      console.log(exists, state);
      if (exists) {
        const filtered = [...state.filter(o => o.column !== column)];
        if (exists.direction === 'ASC') {
          return [...filtered, { column: column, direction: 'DESC' }];
        }

        return filtered;
      }

      return [...state, { column: column, direction: 'ASC' }];
    });
  };
  
  return {
    order,
    direction,
    handleSort,
  };
};

export default useSorting;
