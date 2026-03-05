
export class UpdateProfileDtos {

    private constructor(
        public readonly id:number,
        public readonly name?:string,
    ){}

    get values(){
        const returnObj: {[key:string]: any}={}
        if (this.name) returnObj.name=this.name;
        return returnObj;
    }

    static create(props: {[key:string]:any}): [string?, UpdateProfileDtos?]{
        const { id, name } = props;

        if (name === undefined) return ['name must be provided'];
        
    
        if (!Number.isInteger(id)) return ['Id must be an integer'];
        if (id <= 0) return ['Id must be a positive integer'];

        if (typeof name !== 'string') return ['Invalid name format'];
        if (!name.trim()) return ['Name cannot be empty'];

        return [undefined, new UpdateProfileDtos(id, name?.trim())]
    }
}