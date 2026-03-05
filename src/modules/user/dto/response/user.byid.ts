import { CustomError } from "../../../../shared";
import { validate } from "../../../../utils";

export interface UserRole {
    id: number;
    name: string;
}

export class User {

    constructor(
        public id:number,
        public email:string,
        public name:string,
        public rol:UserRole[],
        // public img?:string,
    ){}

    static fromObject= (object:{[key:string]:any} ):User => {
        const {id, email, name, roles} = object;

        if (!Number.isInteger(id)) throw CustomError.badRequest('Id must be an integer');
        if (id <= 0) throw CustomError.badRequest('Id must be a positive integer');

        if (typeof name !== 'string') throw CustomError.badRequest('Missing or invalid name');
        if (!name || !name.trim()) throw CustomError.badRequest('Name cannot be empty');

        if (typeof email !== 'string') throw CustomError.badRequest('Missing or invalid email');
        if (!email || !email.trim()) throw CustomError.badRequest('Email cannot be empty');
        if (!validate.email(email)) {throw CustomError.badRequest('Email is not valid')};
        
        let validatedRoles: UserRole[] = [];
        if (!Array.isArray(roles)) throw CustomError.badRequest('Roles must be an array');
        if (roles.length > 0) {
             validatedRoles = this.validateRoles(roles);
        }
        // if (img && typeof rol !== 'string') throw CustomError.badRequest('Missing or invalid profile image');
        // if (!img.trim()) throw CustomError.badRequest('Image profile cannot be empty');
            
        return new User(id, email, name, validatedRoles);
    }

    private static validateRoles = (roles: any[]): UserRole[] => {
        return roles.map((role, index) => {
            if (!Number.isInteger(role.id) || role.id <= 0) throw CustomError.badRequest(`Role has an invalid id`);
            if (role.id <= 0) throw CustomError.badRequest('Id must be a positive integer');

            if (typeof role.name !== 'string') throw CustomError.badRequest('Missing or invalid name');
            if (!role.name || !role.name.trim()) throw CustomError.badRequest('Name cannot be empty');

            return { id: role.id, name: role.name.trim() };
        });
    }
}