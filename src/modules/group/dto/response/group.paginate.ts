import { PaginateDto } from "../../../../shared";

export class GroupPaginateDtos extends PaginateDto {

    private constructor(
        public readonly page:number,
        public readonly lim:number,
        public readonly userid:number,
        public readonly search?:string,
    ) {
        super(page, lim, search);
    }   

    static create(object:{[key:string]:any}): [string?, GroupPaginateDtos?] {
        const { page, lim, search, userid } = object;

        const error = this.valid({page, lim, search});
        if (error) return [error];

        if (!Number.isInteger(userid)) return ['User id must be an integer'];
        if (userid <= 0) return ['User id must be a positive integer'];

        return [undefined, new GroupPaginateDtos(page, lim, userid, search?.trim().toLowerCase())];
    }
}