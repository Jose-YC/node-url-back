import { Router } from "express";
import { GroupController } from "../controller/group.controller";
import { AuthMiddleware } from "../../../middlewares";

export class GroupRoutes {

    static get routes():Router{
        const router = Router();
        // controlador
        const group= new GroupController();
        const middleware = new AuthMiddleware();
        
        router.post('/', [middleware.validateJWT],group.post);
        router.get('/', [middleware.validateJWT],group.get);
        router.get('/:id', [middleware.validateJWT],group.getId);
        router.patch('/:id', [middleware.validateJWT],group.put);
        router.delete('/:id', [middleware.validateJWT], group.delete);

        return router;
    }
}