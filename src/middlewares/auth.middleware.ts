import { NextFunction, Request, Response } from "express";
import { jwtAdapter, userContextManager, CustomError } from "../shared";
import { UserDatasource } from "../modules/user";
import { extractJWT } from "./helpers/extractJWT";


export class AuthMiddleware {

    public validateJWT = async (req: Request, res: Response, next: NextFunction ) => {
        const token = extractJWT(req);
        if (!token) return next();

        try {
            const payload = await jwtAdapter.validatetJWT<{ id: number }>(token);
            if (!payload) return next(CustomError.unAuthorized("Unauthorized"));

            const user = await new UserDatasource().getPermissions(payload.id);

            if (!user) return next(CustomError.unAuthorized("Unauthorized"));
            
            // Establecer el contexto del usuario para la petición actual
            userContextManager.run(user, () => next());
    
        } catch (error) {
            return next(CustomError.internalServer("Server error while validating token"));
        }
    };

    public validatePermissions(...permissions: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!userContextManager.hasContext()) return next(CustomError.unAuthorized("Unauthorized"));

                const userPermissions = userContextManager.getValue('permissions');
                if (!userPermissions || userPermissions.length === 0) return next(CustomError.unAuthorized("Forbidden"));
                
                const hasAllPermissions = permissions.every(permission =>  userPermissions.includes(permission));
                if (!hasAllPermissions) 
                    return next(CustomError.unAuthorized("Forbidden"));

                next();
            } catch (error) {
                return next(CustomError.internalServer("Server error while validating permissions"));
            }
        };
    }
}
