import { Injectable } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";
import { UserRepository } from "./user.repository";
import { SessionService } from "../authentication/session.service";
import { User } from "../entities/User";
import { CreateMasterUserDto } from "./dto/create-master-user.dto";

import * as bcrypt from "bcrypt";

import { AppRoles, DeliveryDetails } from "../../../common/types";
import { LoginMasterUserDto } from "./dto/login-master-user.dto";
import {
   InvalidPasswordException,
   InvalidRoleException,
   MasterLoginHasAlreadyBeenTaken,
   PasswordIsTooShortException,
   PhoneIsAlreadyTakenException,
   UserDoesNotExistException
} from "../../shared/exceptions/user.exceptions";
import { UnexpectedServerError } from "../../shared/exceptions/unexpected-errors.exceptions";
import { APP_ROLES } from "../../types/contants";
import { UserCredentialsDto } from "./dto/user-creds.dto";

require("dotenv").config();
@Injectable()
export class UserService {
   constructor(private sessionService: SessionService, private userRepository: UserRepository) {}

   async getUserCredentials(phoneNumber: string): Promise<UserCredentialsDto | null> {
      const phoneNumberWithPlus = "+" + phoneNumber;
      return this.userRepository.getUserCredentials(phoneNumberWithPlus);
   }

   async updateUserRememberedDeliveryAddress(userId: number, deliveryDetails: string): Promise<void> {
      const updated: Partial<User> = {
         remembered_delivery_address: deliveryDetails as unknown as DeliveryDetails
      };
      await this.userRepository.update(userId, updated);
   }

   async updateUsername(name: string, userId: number): Promise<void> {
      return this.userRepository.updateUsername(name, userId);
   }

   async registerSuperAdmin(): Promise<void> {
      try {
         const login = process.env.SUPERADMIN_LOGIN;
         const password = process.env.SUPERADMIN_PASSWORD;
         const name = process.env.SUPERADMIN_NAME;

         const hash = await bcrypt.hash(password, 10);

         const u: User = {
            login,
            password: hash,
            name,
            role: AppRoles.master
         };
         console.log("Registering Super Admin");
         const ok = await this.userRepository.registerSuperAdmin(u);
         if (ok) {
            console.log("Success");
         } else {
            console.log("Fail. Super Admin already exists");
         }
      } catch (e) {
         console.log("Fail");
         throw e;
      }
   }

   async loginMaster(b: LoginMasterUserDto): Promise<{ id: number; role: AppRoles }> {
      const { login, password } = b;

      const u = (await this.userRepository.get({ where: { login } }))[0];
      if (!u) {
         throw new UserDoesNotExistException(null, login);
      }
      const userPassword = u.password;

      const compResult = await bcrypt.compare(password, userPassword);
      if (!compResult) {
         throw new InvalidPasswordException();
      }

      return {
         id: u.id,
         role: u.role
      };
   }

   async login(body: { phone_number: string }): Promise<Partial<User> | null> {
      const { phone_number } = body;

      const user: Partial<User> = (
         await this.userRepository.get({
            where: { phone_number },
            returning: ["id"]
         })
      )[0];

      if (!user) {
         return null;
      }

      return user;
   }

   async authMe(userId: number): Promise<Partial<User>> {
      const users = await this.userRepository.get({
         where: { id: userId },
         returning: ["phone_number", "role"]
      });
      const u = users[0];
      return u;
   }

   async createUser(registerUserDto: RegisterUserDto): Promise<User> {
      const { phone_number } = registerUserDto;

      try {
         const basicUser: User = {
            role: AppRoles.user,
            phone_number
         };

         const user = await this.userRepository.save(basicUser);

         return user;
      } catch (e) {
         const msg: string = e.message;
         if (msg.includes("duplicate")) throw new PhoneIsAlreadyTakenException(phone_number);
         throw new UnexpectedServerError();
      }
   }
   async getUsername(phoneNumber: string): Promise<string> {
      const phoneNumberWithPlus = "+" + phoneNumber;
      return this.userRepository.getUsername(phoneNumberWithPlus);
   }
   async createMasterUser(createMasterUserDto: CreateMasterUserDto): Promise<User> {
      const hashedPass = await bcrypt.hash(createMasterUserDto.password, 10);
      const { role: inputRole } = createMasterUserDto;

      if (!APP_ROLES.includes(inputRole)) {
         throw new InvalidRoleException(inputRole);
      }

      if (createMasterUserDto.password.length < 8) {
         throw new PasswordIsTooShortException();
      }

      const user: User = {
         ...createMasterUserDto,
         password: hashedPass
      };

      try {
         const masterUser = await this.userRepository.save(user);
         return masterUser;
      } catch (e) {
         throw new MasterLoginHasAlreadyBeenTaken();
      }
   }

   async getUserId(phone_number: string): Promise<number | undefined> {
      const user = (
         await this.userRepository.get({
            where: { phone_number },
            returning: ["id"]
         })
      )[0];
      return user === undefined ? undefined : user.id;
   }

   async getUserRole(user_id: number): Promise<string> {
      const user = (
         await this.userRepository.get({
            where: { id: user_id },
            returning: ["role"]
         })
      )[0];
      if (!user) throw new UserDoesNotExistException(user_id);

      return user.role;
   }

   async getUserPhone(user_id: number): Promise<string> {
      const user = (
         await this.userRepository.get({
            where: { id: user_id },
            returning: ["phone_number"]
         })
      )[0];

      if (!user) throw new UserDoesNotExistException(user_id);

      return user.phone_number;
   }

   async getMasterLogin(user_id: number): Promise<string> {
      const user = await this.userRepository.getById(user_id);
      return user?.login;
   }
}
