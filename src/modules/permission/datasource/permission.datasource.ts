import { prisma } from '../../../config';
import { List, CustomError } from '../../../shared';
import { CreatePermissionDtos, Permission, UpdatePermissionDtos } from '../dto';
import { PermissionPaginateDtos } from '../dto/response/permission.paginate';


export class PermissionDatasource {

    async create(createPermission: CreatePermissionDtos): Promise<Boolean> {
        const permission = await prisma.permission.create({data: createPermission!});
        return !!permission;
    }
    
    async get(paginate:PermissionPaginateDtos): Promise<List<Permission>> {
        const [count, permissions] = await Promise.all([
             await prisma.$queryRaw<{ fc_countlistpermissions: number }[]>`
                SELECT * FROM fc_CountListPermissions(
                search := ${paginate.search}::TEXT
            );`,

            await prisma.$queryRaw<Permission[]>`SELECT * FROM fc_ListPermissions(
                page := ${paginate.page}::integer,
                lim := ${paginate.lim}::integer,
                search := ${paginate.search}::TEXT
            );`
        ]);

        return { 
            total: count[0].fc_countlistpermissions, 
            items: permissions.map(permission => Permission.fromObject(permission))
        };
    }

    async getId(id: number): Promise<Permission> {
        const permission = await prisma.permission.findFirst({where: { id, deleted_at:null }});
        if (!permission) throw CustomError.badRequest('This permission does not exist');

        return Permission.fromObject(permission!);
    }
    
    async update(updatePermission: UpdatePermissionDtos): Promise<Boolean> {
        await this.getId(updatePermission.id);
        const permission = await prisma.permission.update({where: {id: updatePermission.id, deleted_at:null}, data: updatePermission!.values});
        return !!permission;
    }
    
    async delete(id: number): Promise<Boolean> {
        await this.getId(id);
        const permission = await prisma.permission.update({where: { id, deleted_at:null }, data: {deleted_at: new Date()}});
        return !!permission;
    }
}