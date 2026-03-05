
export class CreatePermissionDtos {

    private constructor(
        public readonly name:string,
        public readonly module:string,
    ){}

    static create(props: {[key:string]:any}): [string?, CreatePermissionDtos?]{
        const { name, module } = props;
        
        if (typeof name !== 'string') return ['Missing or invalid name'];
        if (!name || !name.trim()) return ['Name cannot be empty'];

        if (typeof module !== 'string') return ['Missing or invalid module'];
        if (!module || !module.trim()) return ['Module cannot be empty'];

        return [undefined, new CreatePermissionDtos(name.trim().toLowerCase(), module.trim())];
    }
}