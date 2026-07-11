interface IPagination<T, R> {
    findAll({
        page,
        limit,
        where,
        props: { }
    }: {
        page: number;
        limit: number;
        where?: T;
        props?: any;
    }): Promise<R[]>;

    count(params: {
        where?: T;
        props?: any;
    }): Promise<number>;
}


interface PaginationBase {
    page: number;
    limit: number;
}