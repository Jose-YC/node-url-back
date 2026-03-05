import { CustomError } from "../../../../shared";

export class Group {

    constructor(
        public id:number,
        public name:string,
        public description?:string,
    ){}

    static fromObject= (object:{[key:string]:any} ):Group => {
        const { id, name, description } = object;

        if (!Number.isInteger(id)) throw CustomError.badRequest('Id must be an integer');
        if (id <= 0) throw CustomError.badRequest('Id must be a positive integer');

        if (typeof name !== 'string') throw CustomError.badRequest('Missing or invalid name');
        if (!name || !name.trim()) throw CustomError.badRequest('Name cannot be empty');

        if (description !== undefined) {
            if (typeof description !== 'string') throw CustomError.badRequest('Missing or invalid description');
            if (!description || !description.trim()) throw CustomError.badRequest('Description cannot be empty');
        }

        return new Group(id, name, description);
    }
}