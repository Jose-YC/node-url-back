
export class UpdateGroupDtos {

    private constructor(
        public readonly id:number,
        public readonly user_id:number,
        public readonly name?:string,
        public readonly description?:string,
    ){}

    static create(props: {[key:string]:any}): [string?, UpdateGroupDtos?]{
        const {id, name, description, userid} = props;

        if (!Number.isInteger(id)) return ['Id must be an integer'];
        if (id <= 0) return ['Id must be a positive integer'];

         if (name === undefined && description === undefined) {
            return ['At least one of name or description must be provided'];
        }

        if (name !== undefined) {
            if (typeof name !== 'string') return ['Missing or invalid name'];
            if (!name ||!name.trim()) return ['Name cannot be empty'];
        }
        
        if (description !== undefined) {
            if (typeof description !== 'string') return ['Missing or invalid description'];
            if (!description || !description.trim()) return ['Description cannot be empty'];
        }
            
        if (!Number.isInteger(userid)) return ['User id must be an integer'];
        if (userid <= 0) return ['User id must be a positive integer'];

        return [undefined, new UpdateGroupDtos(id, userid, name?.trim(), description?.trim())];    
    }
}