import { validate } from "../../../../utils";

export class LoginDtos {

    private constructor(
        public readonly email:string,
        public readonly password:string, 
    ){}

    static create(props: {[key:string]:any}): [string?, LoginDtos?]{
        const {email, password} = props;
        
        if (typeof email !== 'string') return ['Missing or invalid email'];
        if (!email || !email.trim()) return ['Email cannot be empty'];
        if (!validate.email(email)) return ['Invalid email'];

        if (typeof password !== 'string') return ['Missing or invalid password'];
        if (!password || !password.trim()) return ['Password cannot be empty'];

        return [undefined, new LoginDtos(email, password)]
    }
}