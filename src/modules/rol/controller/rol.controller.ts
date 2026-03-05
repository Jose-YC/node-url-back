import { Response, Request } from 'express'
import { CreateRolDtos, RolPaginateDtos, UpdateRolDtos } from '../dto';
import { RolDatasource } from '../datasource/rol.datasource';
import { catchAsync, CustomError, errorHandler } from '../../../shared';

export class RolController { 

    public post = catchAsync((req:Request, res:Response) =>  {
        const [ error, createRolDtos ] = CreateRolDtos.create(req.body);
        if (error) throw CustomError.badRequest(error); 

        new RolDatasource().create(createRolDtos!)
        .then((status) => res.status(201).json({ status, code: 201, message: 'ok' }))
        .catch((err) => errorHandler(err, res));

    })

    public get = catchAsync((req:Request, res:Response) =>  {
        const {  page = 0, lim = 5, search } = req.query;

        const [ error, paginate ] = RolPaginateDtos.create( {page: +page, lim: +lim, search});
        if (error) throw CustomError.badRequest(error); 

        new RolDatasource().get(paginate!)
        .then((data) => res.status(200).json({ status:true, code: 200, message: 'ok', data }))
        .catch((err) => errorHandler(err, res));

    })

    public getId = catchAsync((req:Request, res:Response) =>  {
        const id = +req.params.id;
        if (!id) throw CustomError.badRequest('Missing id');

        new RolDatasource().getId(+id)
        .then((data) => res.status(200).json({ status:true, code: 200, message: 'ok', data }))
        .catch((err) => errorHandler(err, res));
    })

    public put = catchAsync((req:Request, res:Response) =>  {
        const id = +req.params.id;

        const [ error, updateRolDtos ] = UpdateRolDtos.create({...req.body, id});
        if (error) throw CustomError.badRequest(error);

        new RolDatasource().update(updateRolDtos!)
        .then((status) => res.status(200).json({ status, code: 200, message: 'ok' }))
        .catch((err) => errorHandler(err, res));

    })

    public delete = catchAsync((req:Request, res:Response) =>  {
        const id = +req.params.id;
        if (!id) throw CustomError.badRequest('Missing id');

        new RolDatasource().delete(id)
        .then((status) => res.status(200).json({ status, code: 200, message: 'ok' }))
        .catch((err) => errorHandler(err, res));

    })
}