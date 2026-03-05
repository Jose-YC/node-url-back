
export class CreateGroupDtos {

    private constructor(
        public readonly user_id:number,
        public readonly name:string,
        public readonly description?:string,
    ){}

    static create(props: {[key:string]:any}): [string?, CreateGroupDtos?]{
        const { name, description, userid } = props;
        
        if (typeof name !== 'string') return ['Missing or invalid name'];
        if (!name || !name.trim()) return ['Name cannot be empty'];

        if (description !== undefined) {
            if (typeof description !== 'string') return ['Missing or invalid description'];
            if (!description.trim()) return ['Description cannot be empty'];
        }

        if (!Number.isInteger(userid)) return ['User id must be an integer'];
        if (userid <= 0) return ['User id must be a positive integer'];

        return [undefined, new CreateGroupDtos(userid, name.trim().toLowerCase(), description?.trim())];
    }
}