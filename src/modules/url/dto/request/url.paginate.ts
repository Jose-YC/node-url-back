import { PaginateDto } from "../../../../shared";

export class UrlPaginateDtos extends PaginateDto {

    private constructor(
        public readonly page:number,
        public readonly lim:number,
        public readonly userid?:number,
        public readonly search?:string,
        public readonly visibility?:boolean,
        public readonly is_favorite?:boolean,
        public readonly groupid?:number,
    ) {
        super(page, lim, search);
    }   

    static create(object:{[key:string]:any}): [string?, UrlPaginateDtos?] {
        const { page, lim, search, userid, visibility, groupid, favorite } = object;

        const error = this.valid({page, lim, search});
        if (error) return [error];

        if (userid !== undefined) {
            if (!Number.isInteger(userid)) return ['User id must be an integer'];
            if (userid <= 0) return ['User id must be a positive integer'];
        }

        if (groupid !== undefined) {
            if (!Number.isInteger(groupid)) return ['Group id must be an integer'];
            if (groupid <= 0) return ['Group id must be a positive integer'];
        }

        const validValues = [true, false, 'true', 'false', '1', '0', 1, 0];
        if (visibility !== undefined) {
            if (!validValues.includes(visibility)) {
                return ['Visibility must be a boolean'];
            }
        }

        if (favorite !== undefined) {
            if (!validValues.includes(favorite)) {
                return ['Is favorite must be a boolean'];
            }
        }

        return [
            undefined, 
            new UrlPaginateDtos(
                parseInt(page), 
                parseInt(lim), 
                parseInt(userid), 
                search?.trim().toLowerCase(), 
                visibility, 
                favorite,
                parseInt(groupid),
            )
        ];
    }
}