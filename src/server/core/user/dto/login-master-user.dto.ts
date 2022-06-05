import {IsDefined, IsString} from "class-validator";


export class LoginMasterUserDto {
    @IsDefined()
    @IsString()
    login: string
    @IsDefined()
    @IsString()
    password: string
}