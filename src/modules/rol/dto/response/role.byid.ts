import { CustomError } from "../../../../shared";
import { Permission } from "../../../permission/dto";

export class Rol {

    constructor(
        public id:number,
        public name:string,
        public description:string,
        public permissions: Permission[]
    ){}

    static fromObject= (object:{[key:string]:any} ):Rol => {
        const { id, name, description, permissions}  = object;

        if (!Number.isInteger(id)) throw CustomError.badRequest('Id must be an integer');
        if (id <= 0) throw CustomError.badRequest('Id must be a positive integer');

        if (typeof name !== 'string') throw CustomError.badRequest('Missing or invalid name');
        if (!name || !name.trim()) throw CustomError.badRequest('Name cannot be empty');

        if (typeof description !== 'string') throw CustomError.badRequest('Missing or invalid description');
        if (!description || !description.trim()) throw CustomError.badRequest('Description cannot be empty');

        if (!Array.isArray(permissions)) throw CustomError.badRequest('Permissions must be an array');
        if (permissions.length > 0) {
            permissions.map(p => Permission.fromObject(p));
        }
        
        return new Rol(id, name.trim().toLowerCase(), description.trim(), permissions);
    }
}