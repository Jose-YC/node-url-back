import { validate } from "../../../../utils";
import { CustomError } from "../../../../shared";

export class Users {

    constructor(
        public id:number,
        public email:string,
        public name:string,
        // public img?:string,
    ){}

    static fromObject= (object:{[key:string]:any} ):Users => {
        const { id, email, name } = object;

        if (!Number.isInteger(id)) throw CustomError.badRequest('Id must be an integer');
        if (id <= 0) throw CustomError.badRequest('Id must be a positive integer');

        if (typeof name !== 'string') throw CustomError.badRequest('Missing or invalid name');
        if (!name || !name.trim()) throw CustomError.badRequest('Name cannot be empty');

        if (typeof email !== 'string') throw CustomError.badRequest('Missing or invalid email');
        if (!email || !email.trim()) throw CustomError.badRequest('Email cannot be empty');
        if (!validate.email(email)) {throw CustomError.badRequest('Email is not valid')};
        
        // if (img && typeof rol !== 'string') throw CustomError.badRequest('Missing or invalid profile image');
        // if (!img.trim()) throw CustomError.badRequest('Image profile cannot be empty');
            
        return new Users(id, email, name);
    }

    
}