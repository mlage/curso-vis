export type Table = CommonTable;

interface CommonTable {
    name: string;
    columns: Column[];
}

export interface Column {
    name: string;
    type: string;
}