import { Response, Request } from 'express'
import { CreateGroupDtos, GroupPaginateDtos, UpdateGroupDtos } from '../dto';
import { GroupDatasource } from '../datasource/group.datasource';
import { catchAsync, CustomError, errorHandler, userContextManager } from '../../../shared';

export class GroupController { 

    public post = catchAsync((req:Request, res:Response) =>  {
        const userid  = userContextManager.getValue('id');
        if (!userid) throw CustomError.unAuthorized("Not logged in");

        const [ error, createGroupDtos ] = CreateGroupDtos.create({ ...req.body, userid });
        if (error) throw CustomError.badRequest(error);

        new GroupDatasource().create(createGroupDtos!)
        .then((status) => res.status(201).json({ status, code: 201, message: 'ok' }))
        .catch((err) => errorHandler(err, res));
    })

    public get = catchAsync((req:Request, res:Response) =>  {
        const userid  = userContextManager.getValue('id');
        if (!userid) throw CustomError.unAuthorized("Not logged in");

        const {  page = 0, lim = 5, search } = req.query;

        const [ error, paginate ] = GroupPaginateDtos.create( {page: +page, lim: +lim, userid, search});
        if (error) throw CustomError.badRequest(error);

        new GroupDatasource().get(paginate!)
        .then((data) => res.status(200).json({ status:true, code: 200, message: 'ok', data }))
        .catch((err) => errorHandler(err, res));
    })

    public getId = catchAsync((req:Request, res:Response) =>  {
        const id = +req.params.id;
        const userid  = userContextManager.getValue('id');

        if (!userid) throw CustomError.unAuthorized("Not logged in");
        if (!id) throw CustomError.badRequest('Missing id');

        new GroupDatasource().getId(+id, +userid)
        .then((data) => res.status(200).json({ status:true, code: 200, message: 'ok', data }))
        .catch((err) => errorHandler(err, res));
    })

    public put = catchAsync((req:Request, res:Response) =>  {
        const id = +req.params.id;
        const userid  = userContextManager.getValue('id');
        if (!userid) throw CustomError.unAuthorized("Not logged in");

        const [ error, updateGroupDtos ] = UpdateGroupDtos.create({...req.body, id, userid});
        if (error) throw CustomError.badRequest(error);

        new GroupDatasource().update(updateGroupDtos!)
        .then((status) => res.status(200).json({ status, code: 200, message: 'ok' }))
        .catch((err) => errorHandler(err, res));
    })

    public delete = catchAsync((req:Request, res:Response) =>  {
        const id = +req.params.id;
        const userid  = userContextManager.getValue('id');

        if (!userid) throw CustomError.unAuthorized("Not logged in");
        if (!id) throw CustomError.badRequest('Missing id');

        new GroupDatasource().delete(id, userid)
        .then((status) => res.status(200).json({ status, code: 200, message: 'ok' }))
        .catch((err) => errorHandler(err, res));
    })
}