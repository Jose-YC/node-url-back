import { CustomError } from "../../../../shared";

export class Roles {

    constructor(
        public id:number,
        public name:string,
        public description:string,
        public permissions:number,
    ){}

    static fromObject= (object:{[key:string]:any} ):Roles => {
        const {id, name, description, permissions} = object;

        if (!Number.isInteger(id)) throw CustomError.badRequest('Id must be an integer');
        if (id <= 0) throw CustomError.badRequest('Id must be a positive integer');

        if (typeof name !== 'string') throw CustomError.badRequest('Missing or invalid name');
        if (!name || !name.trim()) throw CustomError.badRequest('Name cannot be empty');

        if (typeof description !== 'string') throw CustomError.badRequest('Missing or invalid description');
        if (!description || !description.trim()) throw CustomError.badRequest('Description cannot be empty');

        if (!Number.isInteger(permissions)) throw CustomError.badRequest('Permissions must be an integer');
        if (permissions < 0) throw CustomError.badRequest('Permissions must be a positive number');

        return new Roles(id, name.trim().toLowerCase(), description.trim(), permissions);
    }
}