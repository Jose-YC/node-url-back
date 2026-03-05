export abstract class PaginateDto {

    protected constructor(
        public page:number,
        public lim:number,
        public search?:string,
    ){}

    protected static valid({page, lim, search}:{[key:string]:any}): string | undefined {

        if (!Number.isInteger(page) || !Number.isInteger(lim)) return 'Page and limit must be an integer';
        if (page < 1 || lim < 1) return 'Page or limit must be greater than 0';
        if (search && typeof search !== 'string') return 'Search must be a string';
        if (search !== undefined && !search?.trim()) return "Search cannot be empty";

        return undefined;
    }


}