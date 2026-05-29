// import type { NextFunction, Request, Response } from 'express';
// export const capture = (req: Request, res: Response, next: NextFunction) => {
//     const originResponse = res.json.bind(res);
//     res.json = (data: unknown) => {
//         console.log(data);
//         return originResponse(data);
//     }
//     next();
// }