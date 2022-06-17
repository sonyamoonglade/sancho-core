import {Module} from "@nestjs/common";
import {AuthorizationGuard} from "./authorization.guard";
import {UserModule} from "../user/user.module";


@Module({
    providers: [AuthorizationGuard],
    exports: [AuthorizationGuard],
    imports: [UserModule]
})
export class AuthorizationModule {}