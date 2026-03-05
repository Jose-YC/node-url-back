
export class UpdateRolDtos {

    private constructor(
        public readonly id:number,
        public readonly name?:string,
        public readonly description?:string,
        public readonly permissions_id?:number[],
    ){}

    static create(props: {[key:string]:any}): [string?, UpdateRolDtos?]{
        const {id, name, description, permissions_id} = props;

        if (!Number.isInteger(id)) return ['Id must be an integer'];
        if (id <= 0) return ['Id must be a positive integer'];

        if (name === undefined && description === undefined && permissions_id === undefined) {
            return ['At least one of name, description or permissions must be provided'];
        }
        
        if (name !== undefined) {
            if (typeof name !== 'string') return ['Missing or invalid name'];
            if (!name.trim()) return ['Name cannot be empty'];
        }

        if (description !== undefined) {
            if (typeof description !== 'string') return ['Missing or invalid description'];
            if (!description.trim()) return ['Description cannot be empty'];
        }

        if (permissions_id !== undefined) {
            if (!Array.isArray(permissions_id)) return ['permissions must be an array of numbers'];
            if (permissions_id.length < 2) return ['permissions array must have at least 2 elements'];
            if (permissions_id.some(id => !Number.isInteger(id) || id <= 0)) return ['All elements in permissions must be positive integers'];
            if (new Set(permissions_id).size !== permissions_id.length) return ['permissions_id array cannot contain duplicate values'];
        }
        
        return [undefined, new UpdateRolDtos(id, name?.trim().toLowerCase(), description?.trim(), permissions_id)];
    }
}