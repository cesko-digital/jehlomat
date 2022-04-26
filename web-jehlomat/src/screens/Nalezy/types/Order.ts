import {SortableColumn} from "./SortableColumn";

export interface Order {
    column: SortableColumn;
    direction: 'ASC' | 'DESC';
}
