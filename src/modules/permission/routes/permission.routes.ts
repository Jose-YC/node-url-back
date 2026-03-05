import { Router } from "express";
import { PermissionController } from "../controller/permission.controller";
import { AuthMiddleware } from '../../../middlewares';

export class PermissionRoutes {

    static get routes():Router{
        const router = Router();
        // controlador
        const permission= new PermissionController();
        const authMiddleware = new AuthMiddleware();

        router.get('/', [authMiddleware.validateJWT, authMiddleware.validatePermissions('permission:read')], permission.get);
        router.get('/:id', [authMiddleware.validateJWT, authMiddleware.validatePermissions('permission:readbyid')], permission.getId);
        router.post('/create', [authMiddleware.validateJWT, authMiddleware.validatePermissions('permission:create')], permission.post);
        router.put('/update/:id', [authMiddleware.validateJWT, authMiddleware.validatePermissions('permission:update')], permission.put);
        router.delete('/delete/:id', [authMiddleware.validateJWT, authMiddleware.validatePermissions('permission:delete')], permission.delete);
        
        return router;
    }
}