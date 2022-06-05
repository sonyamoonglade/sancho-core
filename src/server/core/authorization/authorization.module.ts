import {Module} from "@nestjs/common";
import {AuthorizationGuard} from "./authorization.guard";
import {UserService} from "../user/user.service";


@Module({
    providers: [AuthorizationGuard],
    exports: [AuthorizationGuard],
    imports: [UserService]
})
export class AuthorizationModule {}