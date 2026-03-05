import { Router } from "express";
import { RolController } from "../controller/rol.controller";
import { AuthMiddleware } from '../../../middlewares';


export class RolRoutes {

    static get routes():Router{
        const router = Router();
        // controlador
        const rol= new RolController();
        const authMiddleware = new AuthMiddleware();

        router.get('/', [authMiddleware.validateJWT, authMiddleware.validatePermissions('roles:read')], rol.get);
        router.get('/:id', [authMiddleware.validateJWT, authMiddleware.validatePermissions('roles:readbyid')], rol.getId);
        router.post('/create', [authMiddleware.validateJWT, authMiddleware.validatePermissions('roles:create')], rol.post);
        router.put('/update/:id', [authMiddleware.validateJWT, authMiddleware.validatePermissions('roles:update')], rol.put);
        router.delete('/delete/:id', [authMiddleware.validateJWT, authMiddleware.validatePermissions('roles:delete')], rol.delete);
        
        return router;
    }
}