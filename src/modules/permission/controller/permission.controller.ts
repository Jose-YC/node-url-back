import { Request, Response } from "express";
import { CreatePermissionDtos, PermissionPaginateDtos, UpdatePermissionDtos } from "../dto";
import { PermissionDatasource } from "../datasource/permission.datasource";
import { catchAsync, CustomError, errorHandler } from "../../../shared";

export class PermissionController { 

    public post = catchAsync((req:Request, res:Response) =>  {
        const [ error, createPermissionDtos ] = CreatePermissionDtos.create(req.body);
        if (error) throw CustomError.badRequest(error);

        new PermissionDatasource().create(createPermissionDtos!)
        .then((status) => res.status(201).json({ status, code: 201, message: 'ok' }))
        .catch((err) => errorHandler(err, res));

    })

    public get = catchAsync((req:Request, res:Response) =>  {
        const {  page = 0, lim = 5, search } = req.query;

        const [ error, paginate ] = PermissionPaginateDtos.create( {page: +page, lim: +lim, search});
        if (error) throw CustomError.badRequest(error);

        new PermissionDatasource().get(paginate!)
        .then((data) => res.status(200).json({ status:true, code: 200, message: 'ok', data }))
        .catch((err) => errorHandler(err, res));

    })

    public getId = catchAsync((req:Request, res:Response) =>  {
        const id = req.params.id;
        if (!id) throw CustomError.badRequest('Missing id');

        new PermissionDatasource().getId(+id)
        .then((data) => res.status(200).json({ status:true, code: 200, message: 'ok', data }))
        .catch((err) => errorHandler(err, res));
    })

    public put = catchAsync((req:Request, res:Response) =>  {
        const id = req.params.id;

        const [ error, updatePermissionDtos ] = UpdatePermissionDtos.create({...req.body, id: +id});
        if (error) throw CustomError.badRequest(error);

        new PermissionDatasource().update(updatePermissionDtos!)
        .then((status) => res.status(200).json({ status, code: 200, message: 'ok' }))
        .catch((err) => errorHandler(err, res));

    })

    public delete = catchAsync((req:Request, res:Response) =>  {
        const id = req.params.id;
        if (!id) throw CustomError.badRequest('Missing id');

        new PermissionDatasource().delete(+id)
        .then((status) => res.status(200).json({ status, code: 200, message: 'ok' }))
        .catch((err) => errorHandler(err, res));

    })
}