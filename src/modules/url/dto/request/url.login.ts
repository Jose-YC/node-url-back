
export class LoginUrlDtos {

    private constructor(
        public readonly short_url:string,
        public readonly password:string
    ){}

    static create(props: {[key:string]:any}): [string?, LoginUrlDtos?]{
        const { short, password } = props;

        if (typeof short !== 'string') return ['Missing or invalid original url'];
        if (!short || !short.trim()) return ['Original url cannot be empty'];

        if (typeof password !== 'string') return ['Missing or invalid password'];
        if (!password || password.length < 6) return ['Password to short'];

        return [undefined, new LoginUrlDtos(short.trim(), password)];
    }
}