import { CustomError } from "../../../../shared";

export class URL {

    constructor(
        public readonly id:number,
        public readonly original:string,
        public readonly short:string,
        public readonly visibility:boolean,
        public readonly favorite:boolean,
        public readonly statistic:boolean,
        public readonly group_name: string,
        public readonly group_id?: string,
        public readonly title?:string,
    ){}

    static fromObject(props: {[key:string]:any}): URL {
        const { id, original_url, short_url, isPublic, statistic, title, group_name, group_id, is_favorite } = props;
        
        if (!Number.isInteger(id)) throw CustomError.badRequest('Id must be an integer');
        if (id <= 0) throw CustomError.badRequest('Id must be a positive integer');

        if (typeof original_url !== 'string') throw CustomError.badRequest('Missing or invalid original url');
        if (!original_url || !original_url.trim()) throw CustomError.badRequest('Original url cannot be empty');

        if (typeof short_url !== 'string') throw CustomError.badRequest('Missing or invalid short url');
        if (!short_url || !short_url.trim()) throw CustomError.badRequest('Short url cannot be empty');

        if (typeof isPublic !== 'boolean') throw CustomError.badRequest('Invalid is public');
        if (typeof is_favorite !== 'boolean') throw CustomError.badRequest('Invalid is favorite');
        if (typeof statistic !== 'boolean') throw CustomError.badRequest('Invalid statistic');

        if (title !== undefined && title !== null) {
            if (typeof title !== 'string') throw CustomError.badRequest('Invalid title format');
            if (!title.trim()) throw CustomError.badRequest('Title cannot be empty');
        }

        if (typeof group_name !== 'string') throw CustomError.badRequest('Missing or invalid group name');
        if (!group_name || !group_name.trim()) throw CustomError.badRequest('Group name cannot be empty');

        if (group_id !== undefined && group_id !== null) {
            if (!Number.isInteger(group_id)) throw CustomError.badRequest('Group id must be an integer');
            if (group_id <= 0) throw CustomError.badRequest('Group id must be a positive integer');
        }
        return new URL(id, original_url, short_url, isPublic, is_favorite, statistic, group_name, group_id, title);
    }
}