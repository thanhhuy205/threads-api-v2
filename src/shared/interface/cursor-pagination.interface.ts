interface ICursorPagination<T, R> {
    findAll({
        after,
        take,
        where,
        props: { }
    }: { after?: string; take?: number; where?: T; props?: any }): Promise<R[]>;
}
