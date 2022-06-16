import {Injectable, Req, Res} from "@nestjs/common";
import {RegisterUserDto} from "./dto/register-user.dto";
import {UserRepository} from "./user.repository";
import {UnexpectedServerError} from "../exceptions/unexpected-errors.exceptions";
import {SessionService} from "../authentication/session.service";
import {Request, Response} from "express";
import {ValidationService} from "../validation/validation.service";
import {User} from "../entities/User";
import {CreateMasterUserDto} from "./dto/create-master-user.dto";

import * as bcrypt from 'bcrypt'
import {extendedRequest} from "../types/types";
import {ValidationErrorException} from "../exceptions/validation.exceptions";
import {
  InvalidPasswordException,
  InvalidRoleException,
  PasswordIsTooShortException,
  PhoneIsAlreadyTakenException,
  UserDoesNotExistException
} from "../exceptions/user.exceptions";
import {APP_ROLES} from "../../types/types";
import {AppRoles, DeliveryDetails} from "../../../common/types";
import {LoginMasterUserDto} from "./dto/login-master-user.dto";


@Injectable()
export class UserService {
  constructor(private sessionService:SessionService,
              private userRepository:UserRepository,
              private validationService: ValidationService) {}




  async updateUsersRememberedDeliveryAddress(userId: number, deliveryDetails: string): Promise<void>{
    const updated:Partial<User> = {
      remembered_delivery_address: deliveryDetails as unknown as DeliveryDetails
    }
    await this.userRepository.update(userId, updated)
  }

  async loginMaster(b: LoginMasterUserDto): Promise<number>{
    const {login, password} = b

    const u = (await this.userRepository.get({where:{login}}))[0]
    if(!u){
      throw new UserDoesNotExistException(null,login)
    }
    const userPassword = u.password

    const compResult = await bcrypt.compare(password, userPassword)
    if(!compResult) { throw new InvalidPasswordException() }

    return u.id
  }

  async login(body:{phone_number:string}):Promise<Partial<User> | null>{

  const {phone_number} = body

    const user:Partial<User> = (
      await this.userRepository.get(
        {
          where:{phone_number},
          returning:['id']}
      ))[0]

    if(!user) {
      return null
    }

    return user
  }

  async authMe(userId: number): Promise<Partial<User>> {
    const users = await this.userRepository.get({where:{id:userId},returning:["phone_number","role"]})
    const u = users[0]
    return u
  }

  async createUser(registerUserDto:RegisterUserDto, quiet:boolean = false):Promise<User>{
    const {phone_number} = registerUserDto

    try {
        const basicUser:User = {
          role: AppRoles.user,
          phone_number
        }

      const user = await this.userRepository.save(basicUser)

      return user
    }catch (e) {
      const msg:string = e.message
      if(msg.includes('duplicate')) throw new PhoneIsAlreadyTakenException(phone_number)
      throw new UnexpectedServerError()
    }

  }

  async createMasterUser(req:Request, res:Response, createMasterUserDto:CreateMasterUserDto){

    const validationResult = this.validationService.validateObjectFromSqlInjection(createMasterUserDto)
    if(!validationResult) throw new ValidationErrorException()

      const hashedPass = await bcrypt.hash(createMasterUserDto.password,10)
      const {role:inputRole} = createMasterUserDto

      if(!APP_ROLES.includes(inputRole)){
        throw new InvalidRoleException(inputRole)
      }

      if(createMasterUserDto.password.length < 8) {
        throw new PasswordIsTooShortException()
      }

    try {
      const user:User = {
        ...createMasterUserDto,
        password: hashedPass
      }
      let savedUser;
      try {
        savedUser = await this.userRepository.save(user)
      }catch (e) {
        return res.status(400).send({
          statusCode: 400,
          message:"Не уникальный логин!",
        })
      }

      const MASTER_SID = await this.sessionService.createSession(savedUser.id)
      this.sessionService.attachCookieToResponse(res,MASTER_SID)
      return res.status(200).end()

    }catch (e) {
      console.log(e)
      throw new UnexpectedServerError()
    }

  }

  async getUserId(phone_number:string){
    try {
      const id = (await this.userRepository.get({where:{phone_number},returning:['id']}))[0].id
      return id
    }catch (e) {
     return undefined
    }

  }



  async getUserRole(user_id: number):Promise<string>{

    const user = (await this.userRepository.get({where:{id:user_id},returning:['role']}))[0]
    if(!user) throw new UserDoesNotExistException(user_id)

    return user.role

  }

  async getUserPhone(user_id:number):Promise<string>{
    const user = (await this.userRepository.get({where:{id:user_id},returning:['phone_number']}))[0]

    if(!user) throw new UserDoesNotExistException(user_id)

    return user.phone_number
  }

  async getMasterLogin(user_id: number):Promise<string>{
    const user = await this.userRepository.getById(user_id)
    return user?.login
  }

}
