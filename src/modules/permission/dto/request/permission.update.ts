
export class UpdatePermissionDtos {

    private constructor(
        public readonly id:number,
        public readonly name?:string,
        public readonly module?:string,
    ){}

    get values(){
        const returnObj: {[key:string]: any}={}
        if (this.name) returnObj.name=this.name;
        if (this.module) returnObj.module=this.module;
        return returnObj;
    }

    static create(props: {[key:string]:any}): [string?, UpdatePermissionDtos?]{
        const { id, name, module } = props;

        if (!Number.isInteger(id)) return ['Missing or invalid id'];
        if (id <= 0) return ['Id must be a positive integer'];
        
        if (name === undefined && module === undefined) {
            return ['At least one of name or module must be provided'];
        }
        
        if (name !== undefined) {
            if (typeof name !== 'string') return ['Missing or invalid name'];
            if (!name.trim()) return ['Name cannot be empty'];
        }

        if (module !== undefined) {
            if (typeof module !== 'string') return ['Missing or invalid module'];
            if (!module.trim()) return ['Module cannot be empty'];
        }

        return [undefined, new UpdatePermissionDtos(id, name?.trim().toLowerCase(), module?.trim())];
    }
}