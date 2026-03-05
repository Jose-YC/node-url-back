import { validate } from "../../../../utils";


export class CreateUserDtos {

    private constructor(
        public readonly email:string,
        public readonly name:string,
        public readonly password:string, 
        public readonly rol:number[],
    ){}

    static create(props: {[key:string]:any}): [string?, CreateUserDtos?]{
        const { email, name, password, rol } = props;

        if (typeof name !== 'string') return ['Missing or invalid name'];
        if (!name || !name.trim()) return ['Name cannot be empty'];

        if (!Array.isArray(rol)) return ['Missing or invalid rol'];
        if (rol.length < 1) return ['Rol cannot be empty'];
        if (rol.some((r) => !Number.isInteger(r) || r <= 0)) return ['All elements in rol must be positive integers'];
        if (new Set(rol).size !== rol.length) return ['rol array cannot contain duplicate values'];
        

        if (typeof email !== 'string') return ['Missing or invalid email'];
        if (!email || !email.trim()) return ['Email cannot be empty'];
        if (!validate.email(email.trim())) return ['Invalid email'];
        
        if (typeof password !== 'string') return ['Missing or invalid password'];
        if (!password || !password.trim()) return ['Password cannot be empty'];
        if (!validate.password(password)) return ['Password must contain at least 6 characters, including uppercase, lowercase, number, and special character'];

        return [undefined, new CreateUserDtos(email.trim(), name.trim(), password, rol)] 
    }
}