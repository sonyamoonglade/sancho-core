import {query_builder} from "./provider-name";
import {Module} from "@nestjs/common";
import {QueryBuilder} from "./QueryBuilder";


const qbProvider = {
  provide: query_builder,
  useValue: new QueryBuilder(false)
}


@Module({
  providers:[qbProvider],
  exports:[qbProvider]
})
export class QueryBuilderModule{}