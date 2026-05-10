// import { UnauthorizedException } from "@/errors/error";
// import { NextFunction, Request, Response } from "express";

// export const canRelationship = (relation: string, objectType: string) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         const subjectId = req.user?.id;
//         if (!subjectId) {
//             throw new UnauthorizedException('Unauthorized');
//         }

//         const subjectType = 'user'


//     }
// }