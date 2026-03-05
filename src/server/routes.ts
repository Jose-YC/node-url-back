import { Router } from "express";
import { AuthRoutes, PermissionRoutes, RolRoutes, UserRoutes } from "../modules";

export class AppRoutes {

    static get routes():Router{
        const router = Router();
        router.use('/auth', AuthRoutes.routes);
        router.use('/user', UserRoutes.routes);
        router.use('/rol', RolRoutes.routes);
        router.use('/permission', PermissionRoutes.routes);
        return router;
    }
}