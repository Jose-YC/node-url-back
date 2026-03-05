import express, { Router } from 'express';
import { Server as HttpServer } from 'http';
import cors from 'cors';
import { errorMiddleware } from '../middlewares';

interface Options {
    port: number;
    routes: Router;
}

export class Server {

    private readonly app = express();
    private readonly port : number;
    private readonly routes : Router;
    private server?: HttpServer;

    constructor (options: Options) {
        this.port = options.port;
        this.routes = options.routes;
    }
    
    async start() {
        
        this.app.use(cors())
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        
        this.app.use('/', this.routes);
        this.app.use(errorMiddleware);

        this.server = this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });

    };

    public getApp(): express.Application {
        return this.app;
    };

    public close() {
      this.server?.close();
    };
    

}