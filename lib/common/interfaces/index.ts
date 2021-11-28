


export interface TableOptions {
    pageNumber: number,
    pageSize: number,
    filter: string,
    sortOrder: string
}


export interface FormatResponse {
    success: boolean
    payload?: any,
    message?: any
}

export interface DB {
    [key: string]: any;
}

export type Nullable<T> = T | null;
