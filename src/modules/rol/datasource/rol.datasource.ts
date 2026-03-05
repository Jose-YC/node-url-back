
import { CreateRolDtos, Roles, UpdateRolDtos, RolPaginateDtos, Rol } from '../dto';
import { prisma } from '../../../config';
import { List, CustomError } from '../../../shared';

interface RolSP {
    id:number
    name:string
    description:string
    permissions:number
}

interface PermissionSP {
    id:number
    name:string
    module:string
}

interface RolByIdSP {
    id:number
    name:string
    description:string
    permissions: PermissionSP[]
}

export class RolDatasource {

    async create(createRol: CreateRolDtos): Promise<Boolean> {
        const permissions = `{${createRol.permissions_id.join(',')}}`;

        const rol = await prisma.$queryRaw`
            CALL sp_CreateRol(
            role_name := ${createRol.name}::text,
            role_description := ${createRol.description}::text,
            permissions_ids := ${permissions}::integer[]
        );`;

        return !!rol;
    }

    async get(paginate:RolPaginateDtos): Promise<List<Roles>> {

        const [count, roles] = await Promise.all([
            await prisma.$queryRaw<{ fc_countlistroles: number }[]>`
                SELECT * FROM fc_CountListRoles(
                p_search := ${paginate.search}::TEXT
            );`,

            await prisma.$queryRaw<RolSP[]>`SELECT * FROM fc_ListRoles(
                p_page := ${paginate.page}::integer,
                p_limit := ${paginate.lim}::integer,
                p_search := ${paginate.search}::TEXT
            );`
        ]);

        return { total: count[0].fc_countlistroles, items: roles.map(rol => Roles.fromObject(rol))};
    }

    async getId(id: number): Promise<Rol> {
        const [ rol ] = await prisma.$queryRaw<RolByIdSP[]>`
            SELECT * FROM fc_RolById(
            p_rol_id := ${id}::integer
        );`;

        if (!rol) throw CustomError.badRequest('Rol not found');

        return Rol.fromObject(rol);
    }

    async update(updateRol: UpdateRolDtos): Promise<Boolean> {
        const permissions = updateRol.permissions_id ? `{${updateRol.permissions_id.join(',')}}` : null;

        const rol = await prisma.$queryRaw`
            CALL sp_UpdateRol(
            p_role_id := ${updateRol.id}::integer,
            p_role_name := ${updateRol.name}::text,
            p_role_description := ${updateRol.description}::text,
            p_permissions_ids := ${permissions}::integer[]
        );`;

        return !!rol;
    }
    
    async delete(id: number): Promise<Boolean> {
        await this.getId(id);
        const rol = await prisma.role.update({where: { id, deleted_at: null }, data: {deleted_at: new Date()}});
        return !!rol;
    }
}