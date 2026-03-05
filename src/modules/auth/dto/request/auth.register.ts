import { validate } from "../../../../utils";

export class RegisterDtos {

    private constructor(
        public readonly email:string,
        public readonly name:string,
        public readonly password:string, 
    ){}

    static create(props: {[key:string]:any}): [string?, RegisterDtos?]{
        const {email, name, password} = props;

        if (typeof email !== 'string') return ['Missing or invalid email'];
        if (!email || !email.trim()) return ['Email cannot be empty'];
        if (!validate.email(email)) return ['Invalid email'];

        if (typeof name !== 'string') return ['Missing or invalid name'];
        if (!name || !name.trim()) return ['Name cannot be empty'];

        if (typeof password !== 'string') return ['Missing or invalid password'];
        if (!password || !password.trim()) return ['Password cannot be empty'];
        if (!validate.password(password)) return ['Password must contain at least 6 characters, including uppercase, lowercase, number, and special character'];
        
        return [undefined, new RegisterDtos(email, name, password)]
    }
}