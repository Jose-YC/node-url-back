import { CustomError } from "../../../../shared";

export class Permission {

    constructor(
        public id:number,
        public name:string,
        public module:string,
    ){}

    static fromObject= (object:{[key:string]:any} ):Permission => {
        const { id, name, module  } = object;
        
        if (!Number.isInteger(id)) throw CustomError.badRequest('Missing or invalid id');
        if (id <= 0) throw CustomError.badRequest('Id must be a positive integer');

        if (typeof name !== 'string') throw CustomError.badRequest('Missing or invalid name');
        if (!name || !name.trim()) throw CustomError.badRequest('Name cannot be empty');

        if (typeof module !== 'string') throw CustomError.badRequest('Missing or invalid module');
        if (!module || !module.trim()) throw CustomError.badRequest('Module cannot be empty');
        
        return new Permission(id, name, module);
    }
}