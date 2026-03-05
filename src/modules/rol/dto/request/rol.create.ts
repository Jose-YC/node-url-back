
export class CreateRolDtos {

    private constructor(
        public readonly name:string,
        public readonly description:string,
        public readonly permissions_id:number[],
    ){}

    static create(props: {[key:string]:any}): [string?, CreateRolDtos?]{
        const { name, description, permissions_id } = props;
        
        if (typeof name !== 'string') return ['Missing or invalid name'];
        if (!name || !name.trim()) return ['Name cannot be empty'];

        if (typeof description !== 'string') return ['Missing or invalid description'];
        if (!description || !description.trim()) return ['Description cannot be empty'];

        if (!Array.isArray(permissions_id)) return ['permissions must be an array of numbers'];
        if (permissions_id.length < 2) return ['permissions array must have at least 2 elements'];
        if (permissions_id.some(id => !Number.isInteger(id) || id <= 0)) return ['All elements in permissions must be positive integers'];
        if (new Set(permissions_id).size !== permissions_id.length) return ['permissions array cannot contain duplicate values'];

        
        return [undefined, new CreateRolDtos(name.trim().toLowerCase(), description.trim(),  permissions_id)];
    }
}