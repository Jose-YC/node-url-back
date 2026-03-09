import { Response, Request } from 'express'

import { LoginUrlDtos, UpdateUrlDtos, UrlPaginateDtos, CreateUrlDtos } from '../dto';
import { UrlDatasource } from '../datasource/url.datasource';
import { catchAsync, CustomError, errorHandler, userContextManager } from '../../../shared';
import { snowflakeGenerator, ToBase62 } from '../helpers/';

export class UrlController { 

    public post = catchAsync((req:Request, res:Response) =>  {
        const userid  = userContextManager.getValue('id');
        const code =  ToBase62.convert(snowflakeGenerator.generateId());

        const [ error, createUrlDtos ] = CreateUrlDtos.create({ ...req.body, userid, code, expires_at: !!userid});
        if (error) throw CustomError.badRequest(error);

        new UrlDatasource().create(createUrlDtos!)
        .then((status) => res.status(201).json({ status, code: 201, message: 'ok' }))
        .catch((err) => errorHandler(err, res));
    })

    public get = catchAsync((req:Request, res:Response) =>  {
        const userid  = userContextManager.getValue('id'); 
        if (!userid) throw CustomError.unAuthorized("Not logged in");

        const {  page = 1, lim = 5, search, visibility, groupid, favorite } = req.query;

        const [error, paginate] = UrlPaginateDtos.create({ page: +page, lim: +lim, userid, search, visibility, groupid, favorite });
        if (error) throw CustomError.badRequest(error);

        new UrlDatasource().get(paginate!)
        .then((data) => res.json({ status:true, code: 200, message: 'ok', data }))
        .catch((err) => errorHandler(err, res));

    })

    public getId = catchAsync((req:Request, res:Response) =>  {
        const id = +req.params.id;
        const userid  = userContextManager.getValue('id');

        if (!userid) throw CustomError.unAuthorized("Not logged in");
        if (!id) throw CustomError.badRequest('Missing id');

        new UrlDatasource().getId(+id, +userid)
        .then((url) => res.status(200).json({ status:true, code: 200, message: 'ok', url }))
        .catch((err) => errorHandler(err, res));
    })

    public getByShort = catchAsync((req:Request, res:Response) =>  {
        const short = Array.isArray(req.params.short) ? req.params.short[0] : req.params.short;
        if (!short) throw CustomError.badRequest('Missing short');

        new UrlDatasource().getByShort(short)
        .then((url) => res.status(200).json({ status:true, code: 200, message: 'ok', url }))
        .catch((err) => errorHandler(err, res));
    })

    public login = catchAsync((req:Request, res:Response) =>  {
        const short = req.params.short;
        const [ error, login ] = LoginUrlDtos.create({...req.body, short});
        if (error) throw CustomError.badRequest(error);

        new UrlDatasource().login(login!)
        .then((data) => res.status(200).json({ status:true, code: 200, message: 'ok', data }))
        .catch((err) => errorHandler(err, res));
    })

    public put = catchAsync((req:Request, res:Response) =>  {
        const id = +req.params.id;
        const userid  = userContextManager.getValue('id');
        if (!userid) throw CustomError.unAuthorized("Not logged in");

        const [ error, updateUrlDtos ] = UpdateUrlDtos.create({...req.body, id, userid});
        if (error) throw CustomError.badRequest(error);

        new UrlDatasource().update(updateUrlDtos!)
        .then((status) => res.status(200).json({ status, code: 200, message: 'ok' }))
        .catch((err) => errorHandler(err, res));

    })

    public delete = catchAsync((req:Request, res:Response) =>  {
        const id = +req.params.id;
        const userid  = userContextManager.getValue('id');

        if (!userid) throw CustomError.unAuthorized("Not logged in");
        if (!id) throw CustomError.badRequest('Missing id');

        new UrlDatasource().delete(+id, +userid)
        .then((status) => res.status(200).json({ status, code: 200, message: 'ok' }))
        .catch((err) => errorHandler(err, res));

    })

    public toggleFavorite = catchAsync((req:Request, res:Response) =>  {
        const id = +req.params.id;
        const userid  = userContextManager.getValue('id');

        if (!userid) throw CustomError.unAuthorized("Not logged in");
        if (!id) throw CustomError.badRequest('Missing id');

        new UrlDatasource().toggleFavorite(+id, +userid)
        .then((status) => res.status(200).json({ status, code: 200, message: 'ok' }))
        .catch((err) => errorHandler(err, res));

    })

    // public getWithUser = ((req:Request, res:Response) =>  {
    //     const {  page = 0, lim = 5, search, email } = req.query;
        
    //     const [ error, paginate ] = UrlWithUserPaginateDtos.create( {page: +page, lim: +lim, search, email} );
    //     if (error) {res.status(400).json({status:false, code: 400, message: error}); return;};

    //     new UrlDatasource().getWithUser(paginate!)
    //     .then((data) => res.status(200).json({ status:true, code: 200, message: 'ok', data }))
    //     .catch((err) => errorHandler(err, res));

    // })
}