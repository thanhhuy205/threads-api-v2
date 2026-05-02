interface IPagination<T, R> {
    findAll({
        page,
        limit,
        where,
        orderBy
    }: {
        page: number;
        limit: number;
        where?: T;
        orderBy?: any;
    }): Promise<R[]>;

    count(params: {
        where?: T;
    }): Promise<number>;
}


interface PaginationBase {
    page: number;
    limit: number;
}