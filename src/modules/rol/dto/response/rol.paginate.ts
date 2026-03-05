import { PaginateDto } from "../../../../shared";
export class RolPaginateDtos extends PaginateDto {

    private constructor(
        public readonly page:number,
        public readonly lim:number,
        public readonly search?:string,
    ) {
        super(page, lim, search);
    }   

    static create(object:{[key:string]:any}): [string?, RolPaginateDtos?] {
        const { page, lim, search } = object;

        const error = this.valid({page, lim, search});
        if (error) return [error];

        return [undefined, new RolPaginateDtos(page, lim, search?.trim().toLowerCase())];
    }
}