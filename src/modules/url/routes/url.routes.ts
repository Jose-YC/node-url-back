import { Router } from "express";


import { UrlController } from "../controller/url.controller";
import { AuthMiddleware } from "../../../middlewares";


export class UrlRoutes {

    static get routes():Router{
        const router = Router();
        // controlador
        const url= new UrlController();
        const middleware = new AuthMiddleware();

        // rutas del usuario
        router.get('/', [middleware.validateJWT],url.get);
        router.post('/create', [middleware.validateJWT],url.post);
        router.get('/:id', [middleware.validateJWT],url.getId);
        router.patch('/update/:id', [middleware.validateJWT],url.put);
        router.delete('/delete/:id', [middleware.validateJWT], url.delete);
        router.patch('/favorite/:id', [middleware.validateJWT], url.toggleFavorite);

        //rutas publicas
        router.get('/redirect/:short', url.getByShort);
        router.post('/login/:short', url.login);
        
        return router;
    }
}