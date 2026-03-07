import { PaginateDto } from "../../../../shared";

export class UrlWithUserPaginateDtos extends PaginateDto {

    private constructor(
        public readonly page:number,
        public readonly lim:number,
        public readonly search?:string,
        public readonly userid?:number,
        public readonly visibility?:number,
    ) {
        super(page, lim, search);
    }   

    static create(object:{[key:string]:any}): [string?, UrlWithUserPaginateDtos?] {
        const { page, lim, search, userid, visibility } = object;

        const error = this.valid({page, lim, search});
        if (error) return [error];

        if (visibility !== undefined && visibility !== null) 
            if (typeof visibility !== 'boolean') return ['Invalid visibility format'];
        

        return [
            undefined, 
            new UrlWithUserPaginateDtos(
                page, 
                lim, 
                search?.trim().toLowerCase(), 
                userid,
                visibility
            )
        ];
    }
}