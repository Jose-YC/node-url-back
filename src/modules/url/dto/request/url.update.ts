
export class UpdateUrlDtos {

    private constructor(
        public readonly id:number,
        public readonly user_id:number,
        public readonly title?:string,
        public readonly original_url?:string,
        public readonly statistic?:boolean,
        public readonly isPublic?:boolean,
        public readonly password?:string,
        public readonly group_id?:number,

    ){}

    static create(props: {[key:string]:any}): [string?, UpdateUrlDtos?]{
        const {id, userid, title, original, statistic, visibility, password, groupid} = props;

        if (!Number.isInteger(id)) return ['Id must be an integer'];
        if (id <= 0) return ['Id must be a positive integer'];

        if (!Number.isInteger(userid)) return ['User id must be an integer'];
        if (userid <= 0) return ['User id must be a positive integer'];

        if (title === undefined && original === undefined && statistic === undefined && visibility === undefined && password === undefined && groupid === undefined)
            return ['At least one field must be provided for update'];

        if(title !== undefined) {
            if (typeof title !== 'string') return ['Title must be a string'];
            if (!title.trim()) return ['Title cannot be empty'];
        }

        if (original !== undefined) {
            if (typeof original !== 'string') return ['Original URL must be a string'];
            if (!original.trim()) return ['Original URL cannot be empty'];
        }

        if (visibility !== undefined )
            if (typeof visibility !== 'boolean') return ['Visibility must be a boolean'];

        if (statistic !== undefined )
            if (typeof statistic !== 'boolean') return ['statistic must be a boolean'];

        if (visibility === false) {
            if (typeof password !== 'string') return ['Invalid password format'];
            if (password.length < 6) return ['Password to short'];
        }

        if (visibility === true && password !== undefined) 
            return ['Password should not be provided when is public is true'];

        if (groupid !== undefined && groupid !== null){ 
            if (!Number.isInteger(groupid)) return ['Group id must be an integer'];
            if (groupid <= 0) return ['Group id must be a positive integer'];
        }

        return [
          undefined,
          new UpdateUrlDtos(
            id,
            userid,
            title?.trim(),
            original.trim(),
            statistic,
            visibility,
            password,
            groupid
          ),
        ];
    }
}