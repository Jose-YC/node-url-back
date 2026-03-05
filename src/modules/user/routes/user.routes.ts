import { Router } from "express";

import { UserController } from "../controller/user.controller";
import { AuthMiddleware } from '../../../middlewares';


export class UserRoutes {

    static get routes():Router{
        const router = Router();
        // controlador
        const user = new UserController();
        const authMiddleware = new AuthMiddleware();

        router.get('/', [authMiddleware.validateJWT, authMiddleware.validatePermissions('user:read')], user.get);
        router.get('/:id', [authMiddleware.validateJWT, authMiddleware.validatePermissions('user:readbyid')], user.getId);
        router.post('/create', [authMiddleware.validateJWT, authMiddleware.validatePermissions('user:create')], user.post);
        router.patch('/update/:id', [authMiddleware.validateJWT, authMiddleware.validatePermissions('user:update')], user.put);
        router.patch('/profile', [authMiddleware.validateJWT, authMiddleware.validatePermissions('user:profile')], user.profile);
        router.patch('/password', [authMiddleware.validateJWT, authMiddleware.validatePermissions('user:profile')], user.password);
        router.delete('/:id', [authMiddleware.validateJWT, authMiddleware.validatePermissions('user:delete')], user.delete);

        return router;
    }
}