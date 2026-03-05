import { validate } from "../../../../utils";
import { CustomError } from "../../../../shared";


export class UserPermissions {

    constructor(
        public id:number,
        public email:string,
        public name:string,
        public permissions:string[],
        // public img?:string,
    ){}

    static fromObject= (object:{[key:string]:any} ):UserPermissions => {
        const {id, email, name, permissions} = object;

        if (!Number.isInteger(id)) throw CustomError.badRequest('Id must be an integer');
        if (id <= 0) throw CustomError.badRequest('Id must be a positive integer');

        if (typeof name !== 'string') throw CustomError.badRequest('Missing or invalid name');
        if (!name || !name.trim()) throw CustomError.badRequest('Name cannot be empty');

        if (typeof email !== 'string') throw CustomError.badRequest('Missing or invalid email');
        if (!email || !email.trim()) throw CustomError.badRequest('Email cannot be empty');
        if (!validate.email(email)) {throw CustomError.badRequest('Email is not valid')};
        
        if (!Array.isArray(permissions)) throw CustomError.badRequest('Roles must be an array');
        if (permissions.length > 0 ) {
            permissions.some((permission) => {
                if (typeof permission !== 'string') throw CustomError.badRequest('Each role must be a string');
                if (!permission.trim()) throw CustomError.badRequest('Role cannot be empty');
            });
        };
            
        return new UserPermissions(id, email, name, permissions);
    }
}