import { prisma } from "../../../config";
import { CustomError, List } from "../../../shared";
import { CreateGroupDtos, Group, GroupPaginateDtos, UpdateGroupDtos } from "../dto";

interface GroupSP {
    id:number
    name:string
    description:string
}

export class GroupDatasource {

    async create(createGroup: CreateGroupDtos): Promise<Boolean> {
        const group = await prisma.$queryRaw`
            CALL sp_CreateGroup(
            p_user_id := ${createGroup.user_id}::INTEGER,
            p_group_name := ${createGroup.name}::VARCHAR(30),
            p_group_description := ${createGroup.description}::TEXT
        );`;

        return !!group;
    }

    async get(paginate:GroupPaginateDtos): Promise<List<Group>> {

        const [ count, groups] = await Promise.all([
            await prisma.$queryRaw<{ fc_countlistgroups: number }[]>`
                SELECT * FROM fc_CountListGroups(
                p_user_id := ${paginate.userid}::integer,
                p_search := ${paginate.search}::TEXT
            );`,

            await prisma.$queryRaw<GroupSP[]>`SELECT * FROM fc_ListGroups(
                p_user_id := ${paginate.userid}::integer,
                p_page := ${paginate.page}::integer,
                p_limit := ${paginate.lim}::integer,
                p_search := ${paginate.search}::TEXT
            );`
        ]);
        return { total: count[0].fc_countlistgroups, items: groups.map(group => Group.fromObject(group))};
    }

    async getId(id: number, user_id: number): Promise<Group> {
        const group = await prisma.group.findFirst({where: { id, user_id, deleted_at:null }});
        if (!group) throw CustomError.badRequest('This group does not exist');

        return Group.fromObject(group);
    }

    async update(updateGroup: UpdateGroupDtos): Promise<Boolean> {
        
        const group = await prisma.$queryRaw`
            CALL sp_UpdateGroup(
            p_user_id := ${updateGroup.user_id}::INTEGER,
            p_group_id := ${updateGroup.id}::INTEGER,
            p_group_name := ${updateGroup.name}::VARCHAR(30),
            p_group_description := ${updateGroup.description}::TEXT
        );`;
        return !!group;
    }

    async delete(id: number, user_id: number): Promise<Boolean> {
        await this.getId(id, user_id);
        const group = await prisma.group.update({
            where: { id, user_id, deleted_at:null },
            data: { deleted_at: new Date() }
        });
        return !!group;
    }
}