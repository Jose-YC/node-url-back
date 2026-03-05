import { Response, Request } from 'express'
import { catchAsync, CustomError, errorHandler } from '../../../shared';
import { AuthDatasource } from '../datasource/auth.datasource';
import { LoginDtos, RegisterDtos } from '../dto';
import { extractJWT } from '../../../middlewares';

export class AuthController { 

    public login = catchAsync((req:Request, res:Response) =>  {
        const [ error, loginDtos ] = LoginDtos.create(req.body);
        if (error) throw CustomError.badRequest(error); 

        new AuthDatasource().login(loginDtos!)
        .then((data) => res.status(201).json({ status:true, code: 201, message: 'ok', data }))
        .catch((err) => errorHandler(err, res));
    })

    public register = catchAsync((req:Request, res:Response) =>  {
        const [ error, registerDtos ] = RegisterDtos.create(req.body);
        if (error) throw CustomError.badRequest(error); 

        new AuthDatasource().register(registerDtos!)
        .then((data) => res.status(201).json({ status:true, code: 201, message: 'ok', data }))
        .catch((err) => errorHandler(err, res));
    })

    public refresh = catchAsync((req:Request, res:Response) =>  {
        const token = extractJWT(req);
        if (!token) throw CustomError.unAuthorized('No token provided');

        new AuthDatasource().refresh(token)
        .then((token) => res.json({ status:true, code: 200, message: 'ok', data: { token } }))
        .catch((err) => errorHandler(err, res));
    })
}