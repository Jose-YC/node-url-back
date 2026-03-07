import { CustomError } from "../../../../shared";


export class Short {

    constructor(
        public readonly id:number,
        public readonly short:string,
        public readonly visibility:boolean,
        public readonly original?:string,
    ){}

    static fromObject(props: {[key:string]:any}): Short {
        const { id, original_url, short_url, isPublic } = props;

        if (!Number.isInteger(id)) throw CustomError.badRequest('Id must be an integer');
        if (id <= 0) throw CustomError.badRequest('Id must be a positive integer');

        if (typeof isPublic !== 'boolean') throw CustomError.badRequest('Invalid is public');

        if (typeof short_url !== 'string') throw CustomError.badRequest('Missing or invalid short url');
        if (!short_url ||  !short_url.trim()) throw CustomError.badRequest('Short url cannot be empty');;

        if (original_url !== undefined) {
            if (typeof original_url !== 'string') throw CustomError.badRequest('Invalid url original format');
            if (!original_url.trim()) throw CustomError.badRequest('Original url cannot be empty');
        }

        return new Short(id, short_url, isPublic, original_url);
    }
}