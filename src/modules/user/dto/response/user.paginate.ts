import { PaginateDto } from "../../../../shared";

export class UserPaginateDtos extends PaginateDto {

    private constructor(
        public readonly page:number,
        public readonly lim:number,
        public readonly search?:string,
        public readonly rol?:string,
    ) {
        super(page, lim, search);
    }   

    static create({ page, lim, search, rol }:{[key:string]:any}): [string?, UserPaginateDtos?] {

        const error = this.valid({page, lim, search});
        if (error) return [error];

        if (rol !== undefined) {
            if (typeof rol !== 'string') return ['Missing or invalid rol'];
            if (!rol.trim()) return ['Rol cannot be empty'];
        }

        return [undefined, new UserPaginateDtos(page, lim, search?.trim(), rol?.trim())];
    }
}