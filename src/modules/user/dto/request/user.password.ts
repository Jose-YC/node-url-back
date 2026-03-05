import { validate } from "../../../../utils";

export class UpdatePasswordDtos {

    private constructor(
        public readonly id:number, 
        public readonly password:string, 
        public readonly oldPassword:string, 
    ){}

    static create(props: {[key:string]:any}): [string?, UpdatePasswordDtos?]{
        const { password, oldPassword, id } = props;

        if (!Number.isInteger(id)) return ['Id must be an integer'];
        if (id <= 0) return ['Id must be a positive integer'];

        if (typeof password !== 'string') return ['Missing or invalid password'];
        if (!password || !password.trim()) return ['Password cannot be empty'];
        if (!validate.password(password)) return ['Password must contain at least 6 characters, including uppercase, lowercase, number, and special character'];

        if (typeof oldPassword !== 'string') return ['Missing or invalid old password'];
        if (!oldPassword || !oldPassword.trim()) return ['Old password cannot be empty'];

        return [undefined, new UpdatePasswordDtos(id, password, oldPassword)] 
    }
}