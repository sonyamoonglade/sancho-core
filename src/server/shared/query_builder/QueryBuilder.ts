export interface filter<T> {
    where: Partial<T>
    returning?: string[] | '*'
    set? : Partial<T> | T
    // or: Partial<any>
}
//or status = blablabla or status = blabla


export class QueryBuilder  {
    private readonly isLoggingSql: boolean = false

    constructor(isLoggingSql?: boolean) {
        this.isLoggingSql = isLoggingSql
    }

    private _tableName: string


    private set setTableName(value: string) {
        this._tableName = value;
    }

    private get getTableName(){
        return this._tableName
    }

    private static makeInsertValuesSql<Entity>(insertedObject: Entity): any[]{

        const keys: string[] = Object.keys(insertedObject)
        const values = Object.values(insertedObject)
        const typeMap: Map<string, any> = this.generateTypeMap(insertedObject,keys)

        const valuePlaceholders = QueryBuilder.generateValuesPlaceholders(values)
        const valuesSQL = `values (${valuePlaceholders})`
        const typedValuesArray: (number | string)[] = QueryBuilder.generateTypedValuesArray(keys,typeMap,values)

        return [valuesSQL,typedValuesArray]

    }

    private static generateValuesPlaceholders(values: any[]){
        let placeholders = ''
        for(let i = 1; i < values.length + 1; i++){
            if(i !== values.length ) placeholders+=`$${i},`
            else placeholders+=`$${i}`

        }
        return placeholders
    }

    private static generateTypedValuesArray(keys: string[], typeMap: Map<string,any>,values: any){
        const output = []
        for(let i = 0; i < keys.length;i++){
            const key = keys[i]
            const value = values[i]
            const type = typeMap.get(key)
            let typedValue;
            switch (type){
                case 'number':{
                    typedValue = Number(value)
                    break
                }
                default: typedValue = value
            }
            output.push(typedValue)
        }
        return output
    }

    private static generateTypeMap(target: any, keys: string[]){
        const typeMap: Map<string, any> = new Map()
        keys.forEach(key => {
            const typeOfKey = typeof target[key]
            typeMap.set(key, typeOfKey)
        })
        return typeMap
    }

    private static generateAssignments(keys:string[],values: any,isForSet: boolean = false){
        let assignments:string[] = []
        for(let i = 0; i < values.length;i++){
            const key = keys[i]
            const value = values[i]
            let assignment = ''
            const separatorBasedOnIsForSet = isForSet ? ',' : 'and';
            if(values.length > 1 && i !== values.length - 1 && typeof value !== 'string') {
                assignment = `${key} = ${value}${separatorBasedOnIsForSet}`
            }
            else if(typeof value == 'string' && i !== values.length -1) {
                 assignment = `${key} = '${value}'${separatorBasedOnIsForSet}`
            }
            else {
                if (typeof value != 'string') assignment = `${key} = ${value}`
                else assignment = `${key} = '${value}'`
            }
            assignments.push(assignment)
        }

        return assignments.join(' ')
    }


    public ofTable(tableName: string): QueryBuilder{
        this.setTableName = tableName
        return this
    }

    public insert<Entity>(insertedObject:Entity): (string | any)[]{
        const [valuesSQL,typedValuesArray] = QueryBuilder.makeInsertValuesSql<Entity>(insertedObject)

        const joinedKeysOfInsertedObject = Object.keys(insertedObject).join(',')
        const SQL = `insert into ${this.getTableName} (${joinedKeysOfInsertedObject}) ${valuesSQL} returning *`
        if(this.isLoggingSql) console.log(SQL);
        return [SQL, typedValuesArray]
    }

    public select<Entity>(expression?: filter<Entity>){
        if(!expression) return `select * from ${this.getTableName}`

        const returning = expression?.returning
        const target = expression.where
        if(target['id']) target['id'] = Number(target['id'])

        const keys = Object.keys(target)
        const values = Object.values(target)

        let SQL;

        const whereStatement = QueryBuilder.generateAssignments(keys,values, false)
        if(returning == '*'){
            SQL = `select * from ${this.getTableName} where ${whereStatement}`

        }
        else if(Array.isArray(returning)){
            const returningValues = (returning as string[]).join(',')
            SQL = `select ${returningValues} from ${this.getTableName} where ${whereStatement}`

        }
        else {
            SQL = `select * from ${this.getTableName} where ${whereStatement}`
        }

        if(this.isLoggingSql) console.log(SQL);

        return SQL


    }

    public delete<Entity>(expression : Pick<filter<Entity>,'where'>){
        const target = expression.where
        if(target['id']) target['id'] = Number(target['id'])
        const keys = Object.keys(target)
        const values = Object.values(target)

        const whereStatement = QueryBuilder.generateAssignments(keys,values)
        const SQL = `delete from ${this.getTableName} where ${whereStatement}`
        if(this.isLoggingSql) console.log(SQL);
        return SQL
    }
    private static generatePlaceholdersForSet(keys:string[]){
        const assignments: string[] = []
        let i = 0;
        for(const key of keys){
            const assignment = `${key}=$${i+1}`
            i++;
            assignments.push(assignment)
        }
        return assignments.join(', ')
    }
    public update<Entity>(expression: filter<Entity>){

        const target = expression.where
        if(target['id']) target['id'] = Number(target['id'])

        const whereKeys = Object.keys(target)
        let whereValues = Object.values(target)

        const whereStatement = QueryBuilder.generateAssignments(whereKeys,whereValues)

        const mapToUpdate = expression.set
        const keysToUpdate = Object.keys(mapToUpdate)


        const [_,values] = QueryBuilder.makeInsertValuesSql(mapToUpdate)
        const setWithPlaceholders = QueryBuilder.generatePlaceholdersForSet(keysToUpdate)
        const SQL = `update ${this.getTableName} set ${setWithPlaceholders} where ${whereStatement}`
        // const SQL = `// update ${this.getTableName} set ${setAssignmentStatement} where ${whereStatement}`
        if(this.isLoggingSql) console.log(SQL);
        return [SQL,values]

    }

}

