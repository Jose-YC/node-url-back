import { validate } from "../../../../utils";


export class UpdateUserDtos {

    private constructor(
        public readonly id:number,
        public readonly name?:string,
        public readonly email?:string,
        public readonly password?:string, 
        public readonly rol?:number[],
    ){}

    static create(props: {[key:string]:any}): [string?, UpdateUserDtos?]{
        const {id, email, name, password, rol} = props;

        if (!Number.isInteger(id)) return ['Id must be an integer'];
        if (id <= 0) return ['Id must be a positive integer'];

        if (name === undefined && email === undefined && password === undefined && rol === undefined) {
            return ['At least one of name, email, password or roles must be provided'];
        }

        if (name !== undefined) {
            if (typeof name !== 'string') return ['Invalid name format'];
            if (!name.trim()) return ['Name cannot be empty'];
        }

        if (password !== undefined) {
            if (typeof password !== 'string') return ['Invalid password format'];
            if (!password.trim()) return ['Password cannot be empty'];
            if (!validate.password(password)) return ['Password must contain at least 6 characters, including uppercase, lowercase, number, and special character'];
        }

        if (rol !== undefined) {
            if (!Array.isArray(rol)) return ['Invalid rol format'];
            if (rol.length < 1) return ['rol array must have at least 1 element'];
            if (rol.some(id => !Number.isInteger(id) || id <= 0)) return ['All elements in rol must be positive integers'];
            if (new Set(rol).size !== rol.length) return ['rol array cannot contain duplicate values'];
            
        }

        if (email !== undefined) {
            if (typeof email !== 'string') return ['Invalid email format'];
            if (!email.trim()) return ['Email cannot be empty'];
            if (!validate.email(email.trim())) return ['Invalid email'];
        }

        return [undefined, new UpdateUserDtos(id, name?.trim(), email?.trim(), password, rol)]
    }
}