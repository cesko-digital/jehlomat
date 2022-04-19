export interface Loader<TData> {
    resp?: TData;
    err?: string | Error;
}
