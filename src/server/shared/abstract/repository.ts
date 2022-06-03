import { filter} from "../../core/query_builder/QueryBuilder";
import { User } from "../../core/entities/User";


export interface Repository<T> {

    save(dto: any): Promise<T>

    getById(id: number| string): Promise<T | undefined>

    update(id: number, updated: Partial<T>): Promise<void>

    get(expression: filter<T>): Promise<Partial<T>[]>

    customQuery(query: string): Promise<T | T[]>

}

