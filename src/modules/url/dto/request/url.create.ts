
export class CreateUrlDtos {

    private constructor(
        public readonly original_url:string,
        public readonly short_url:string,
        public readonly user_id:number,
        public readonly isPublic?:boolean,
        public readonly is_favorite?:boolean,
        public readonly statistic?:boolean,
        public readonly password?:string,
        public readonly title?:string,
        public readonly group_id?:number,
    ){}

    static create(props: {[key:string]:any}): [string?, CreateUrlDtos?]{
        const { original, userid, visibility, statistic, password, title, groupid, favorite, code } = props;

        if (typeof original !== 'string') return ['Missing or invalid original url'];
        if (!original || !original.trim()) return ['Original url cannot be empty'];

        if (typeof code !== 'string') return ['Missing or invalid short code'];
        if (!code || !code.trim()) return ['Short code cannot be empty'];

        if (!original || !original.trim()) return ['Original url cannot be empty'];


        if (!Number.isInteger(userid)) return ['User id must be an integer'];
        if (userid <= 0) return ['User id must be a positive integer'];

        if (visibility !== undefined )
            if (typeof visibility !== 'boolean') return ['Visibility must be a boolean'];
        
        if (favorite !== undefined )
            if (typeof favorite !== 'boolean') return ['Favorite must be a boolean'];

        if (statistic !== undefined )
            if (typeof statistic !== 'boolean') return ['Statistic must be a boolean'];

        if (visibility === false) {
            if (typeof password !== 'string') return ['Invalid password format'];
            if (password.length < 6) return ['Password to short'];
        }

        if (visibility === true && password !== undefined) 
            return ['Password should not be provided when is public is true'];
        

        if (title !== undefined) {
            if (typeof title !== 'string') return ['Invalid title format'];
            if (!title.trim()) return ['Title cannot be empty'];
        }

        if (groupid !== undefined) {
            if (!Number.isInteger(groupid)) return ['Group id must be an integer'];
            if (groupid <= 0) return ['Group id must be a positive integer'];
        }

        return [undefined, new CreateUrlDtos(original.trim(), code.trim(), userid, visibility, statistic, password, title, groupid, favorite)];
    }
}