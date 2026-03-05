import { CustomError } from "../../../../shared";
import { validate } from "../../../../utils";

interface UserDto {
    id: number;
    name: string;
    email: string;
}

export class AuthDtos {

    constructor(
        public token:string,
        public user:UserDto,

    ){}

    static fromObject= (object:{[key:string]:any} ):AuthDtos => {
        const { user, token } = object;
        
        if (typeof token !== 'string') throw CustomError.badRequest('Missing or invalid token');
        if (!token || !token.trim()) throw CustomError.badRequest('Token cannot be empty');

        const validatedUser = this.validateUser(user);

        return new AuthDtos( token, validatedUser);
    }

    private static validateUser (user: any): UserDto {
        if (!user) throw CustomError.badRequest('Missing user data');
        if (typeof user !== 'object' || Array.isArray(user)) throw CustomError.badRequest('Invalid user data');

        const { id, name, email } = user;
         if (!Number.isInteger(id)) throw CustomError.badRequest('Id must be an integer');
         if (id <= 0) throw CustomError.badRequest('Id must be a positive integer')

        if (typeof name !== 'string') throw CustomError.badRequest('Invalid user name');
        if (!name || !name.trim()) throw CustomError.badRequest('Name cannot be empty');

        if (typeof email !== 'string') throw CustomError.badRequest('Invalid user email');
        if (!email || !email.trim()) throw CustomError.badRequest('Email cannot be empty');

        return { id, name: name.trim(), email: email.trim() };
    }
}