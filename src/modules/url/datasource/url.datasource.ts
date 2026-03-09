import { prisma } from "../../../config";
import { bcryptjsAdapter, CustomError, List } from "../../../shared";
import { CreateUrlDtos, UpdateUrlDtos, URL, Short, UrlPaginateDtos, LoginUrlDtos } from "../dto";

interface UrlSP {
    id: number;
    title: string | null;
    short_url: string;
    original_url: string;
    group_name: string;
    group_id?: string;
    isPublic: boolean;
    is_favorite: boolean;
    statistic: boolean;
}
export class UrlDatasource {

    async create(createUrl: CreateUrlDtos): Promise<Boolean> {

        const short = {...createUrl };

        if (createUrl.password && createUrl.isPublic === false) 
            short.password = bcryptjsAdapter.hash(createUrl.password!);

        const url = await prisma.$queryRaw`
            CALL sp_CreateUrl(
            p_group_id := ${createUrl.group_id}::INTEGER,
            p_url_original := ${createUrl.original_url}::TEXT,
            p_url_short := ${createUrl.short_url}::VARCHAR(30),
            p_user_id := ${createUrl.user_id}::INTEGER,
            p_url_public := ${createUrl.isPublic}::BOOLEAN,
            p_url_favorite := ${createUrl.is_favorite}::BOOLEAN,
            p_url_statistic := ${createUrl.statistic}::BOOLEAN,
            p_url_title := ${createUrl.title}::VARCHAR(30),
            p_url_password := ${createUrl.password}::TEXT
        );`;

        return !!url; 
    }

    async get(paginate:UrlPaginateDtos): Promise<List<URL>> {
        const [count, urls] = await Promise.all([
            await prisma.$queryRaw<{ fc_countlisturl: number }[]>`
                SELECT * FROM fc_CountListUrl(
                p_user_id := ${paginate.userid}::integer,
                p_search := ${paginate.search}::TEXT,
                p_visibility := ${paginate.visibility}::boolean,
                p_favorite := ${paginate.is_favorite}::boolean,
                p_group_id := ${paginate.groupid}::integer
            );`,

            await prisma.$queryRaw<UrlSP[]>`SELECT * FROM fc_ListUrl(
                p_page := ${paginate.page}::integer,
                p_limit := ${paginate.lim}::integer,
                p_user_id := ${paginate.userid}::integer,
                p_search := ${paginate.search}::TEXT,
                p_visibility := ${paginate.visibility}::boolean,
                p_favorite := ${paginate.is_favorite}::boolean,
                p_group_id := ${paginate.groupid}::integer
            );`
        ]);

        return { total: count[0].fc_countlisturl, items: urls.map(url => URL.fromObject(url))};
    }

    async getId(id: number, user_id: number): Promise<URL> {
        const [url, ...rest] = await prisma.$queryRaw<UrlSP[]>`
            SELECT * FROM fc_UrlById(
            p_user_id := ${user_id}::integer,
            p_url_id := ${id}::integer
        );`;
        if (!url) throw CustomError.badRequest('This url does not exist');
        
        return URL.fromObject(url);
    }

    async getByShort(short: string): Promise<Short> {
        const url = await prisma.url.findFirst({
            where: { short_url: short, deleted_at:null },
            select: {
                id: true,
                original_url: true,
                short_url: true,
                isPublic: true,
                expires_at: true,
            }
        });

        if (!url) throw CustomError.badRequest('This url does not exist');
        if (url.expires_at && url.expires_at < new Date()) throw CustomError.badRequest('This url has expired');
        if (url.isPublic === true) return Short.fromObject(url);
        
        return Short.fromObject({id: url.id, short_url: url.short_url, isPublic: false});
    }

    async login(login: LoginUrlDtos): Promise<Short> {
        const url = await prisma.url.findFirst({
            where: { short_url: login.short_url, deleted_at:null },
            select: {
                id: true,
                original_url: true,
                short_url: true,
                isPublic: true,
                password:true,
            }
        });

        if (!url) throw CustomError.badRequest('This url does not exist');

        const valid = bcryptjsAdapter.compare(login.password, url.password!);
        if (!valid) throw CustomError.badRequest('Incorrect password');
        
        return Short.fromObject(url);
    }

    async update(updateUrl: UpdateUrlDtos): Promise<Boolean> {
        const update = { ...updateUrl };       

        if (update.password) 
            update.password = bcryptjsAdapter.hash(update.password);

        const url = await prisma.$queryRaw`
            CALL sp_UpdateUrl(
            p_url_id := ${update.id}::INTEGER,
            p_user_id := ${update.user_id}::INTEGER,
            p_url_original := ${update.original_url}::TEXT,
            p_group_id := ${update.group_id}::INTEGER,
            p_url_public := ${update.isPublic}::BOOLEAN,
            p_url_statistic := ${update.statistic}::BOOLEAN,
            p_url_title := ${update.title}::VARCHAR(30),
            p_url_password := ${update.password}::TEXT
        );`;

        return !!url;
    }
    
    async delete(id: number, user_id: number): Promise<Boolean> {
        await this.getId(id, user_id);
        const url = await prisma.url.update({
            where: { id, user_id, deleted_at:null },
            data: { deleted_at: new Date() },
            select: { id: true }
        });
        return !!url;
    }

    async toggleFavorite(id: number, user_id: number): Promise<Boolean> {
        const existingUrl = await prisma.url.findFirst({
            where: { id, user_id, deleted_at: null },
            select: { is_favorite: true }
        });

        if (!existingUrl) throw CustomError.badRequest('This url does not exist');

        const url = await prisma.url.update({
            where: { id, user_id, deleted_at: null },
            data: { is_favorite: !existingUrl.is_favorite  },
            select: { id: true }
        });

        return !!url;
    }
}