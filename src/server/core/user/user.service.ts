import { Injectable } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";
import { UserRepository } from "./user.repository";
import { SessionService } from "../session/session.service";
import { CheckUser, DeliveryUser, MasterUser, User } from "../entities/User";

import * as bcrypt from "bcrypt";

import { AppRoles, DeliveryDetails } from "../../../common/types";
import { LoginMasterUserDto } from "./dto/login-master-user.dto";
import {
   InvalidPasswordException,
   InvalidRoleException,
   MasterLoginHasAlreadyBeenTaken,
   PasswordIsTooShortException,
   PhoneIsAlreadyTakenException,
   UserCredentialsNotFound,
   UserDoesNotExistException
} from "../../packages/exceptions/user.exceptions";
import { UnexpectedServerError } from "../../packages/exceptions/unexpected-errors.exceptions";
import { APP_ROLES } from "../../types/contants";
import { UserCredentialsDto } from "./dto/user-creds.dto";
import { CreateMarkDto } from "../mark/dto/create-mark.dto";
import { DuplicateMark, MarkCannotBeDeleted, MarkDoesNotExist } from "../../packages/exceptions/mark.exceptions";
import { Mark } from "../entities/Mark";
import { MiscService } from "../miscellaneous/misc.service";
import { MarkRepository } from "../mark/mark.repository";
import { OrderService } from "../order/order.service";
import { REGULAR_CUSTOMER_CONTENT } from "../../../common/constants";
import { ValidationErrorException } from "../../packages/exceptions/validation.exceptions";
import { FoundUserDto } from "./dto/found-user.dto";
import { CouldNotGetUserDeliveryData } from "../../packages/exceptions/order.exceptions";
import { PinoLogger } from "nestjs-pino";
import { CreateWorkerUserDto } from "./dto/create-master-user.dto";

export interface MarkRepositoryInterface {
   create(dto: CreateMarkDto): Promise<Mark>;
   delete(userId: number, markId: number): Promise<boolean>;
   getUserMarks(userId: number): Promise<Mark[]>;
   isRegularMark(markId: number): Promise<boolean>;
}

@Injectable()
export class UserService {
   constructor(
      private sessionService: SessionService,
      private userRepository: UserRepository,
      private miscService: MiscService,
      private markRepository: MarkRepository,
      private orderService: OrderService,
      private logger: PinoLogger
   ) {
      this.logger.setContext(UserService.name);
   }

   async prepareDataForCheck(orderId: number): Promise<CheckUser> {
      this.logger.info(`prepare user check data for order ${orderId}`);
      const data = await this.userRepository.prepareDataForCheck(orderId);
      if (!data) {
         throw new CouldNotGetUserDeliveryData();
      }
      this.logger.debug("prepare data success");
      return data;
   }

   async prepareDataForDelivery(orderId: number): Promise<DeliveryUser> {
      this.logger.info(`prepare user delivery data for order ${orderId}`);
      const data = await this.userRepository.prepareDataForDelivery(orderId);
      if (!data) {
         throw new CouldNotGetUserDeliveryData();
      }
      this.logger.debug("prepare data success");
      return data;
   }

   async isRegularMark(markId: number): Promise<boolean> {
      const ok = await this.markRepository.isRegularMark(markId);
      if (ok) {
         throw new MarkCannotBeDeleted();
      }
      return false;
   }

   public generateRegularCustomerMark(userId: number, phoneNumber: string): CreateMarkDto {
      const dto: CreateMarkDto = new CreateMarkDto();
      dto.userId = userId;
      dto.content = REGULAR_CUSTOMER_CONTENT;
      dto.phoneNumber = phoneNumber;
      dto.isImportant = true;
      return dto;
   }

   async getUserCredentials(phoneNumber: string): Promise<UserCredentialsDto> {
      const phoneNumberWithPlus = "+" + phoneNumber;
      const credentialsWithoutMarks: Partial<UserCredentialsDto> = await this.userRepository.getUserCredentials(phoneNumberWithPlus);
      if (!credentialsWithoutMarks) {
         throw new UserCredentialsNotFound(phoneNumberWithPlus);
      }

      const userId = await this.getUserId(phoneNumberWithPlus);
      const userMarks: Mark[] = await this.markRepository.getUserMarks(userId);

      //todo: find new algo!!
      // Get Regular Customer Mark duration in days.
      // todo: replace with cache value
      // const { reg_cust_duration, reg_cust_threshold } = await this.miscService.getAllValues();
      // Check if user has Regular Customer Mark
      // const regCustMark = this.hasRegularCustomerMark(userMarks);
      // if (!regCustMark) {
      //    Get paid and completed order sum in terms of [now-duration,now] period.
      // const sum = await this.orderService.calculateOrderSumInTerms(reg_cust_duration, userId);
      // if (sum >= reg_cust_threshold) {
      //    const regCustMarkDto = this.generateRegularCustomerMark(userId, phoneNumberWithPlus);
      //    const mark: Mark = await this.createMark(regCustMarkDto);
      //    Updating initial marks with newly created Regular Customer mark.
      // userMarks.push(mark);
      // return {
      //    marks: userMarks,
      //    username: credentialsWithoutMarks.username,
      //    userDeliveryAddress: credentialsWithoutMarks.userDeliveryAddress
      // };
      // }
      // Return without Regular Customer mark.
      return {
         marks: userMarks,
         username: credentialsWithoutMarks.username,
         userDeliveryAddress: credentialsWithoutMarks.userDeliveryAddress
      };
      // }

      // const isStillRegCust = await this.userRepository.isStillRegularCustomer(reg_cust_duration, regCustMark.id);
      // if (isStillRegCust) {
      //    // Keep marks the same
      //    const credentials: UserCredentialsDto = {
      //       userDeliveryAddress: credentialsWithoutMarks?.userDeliveryAddress,
      //       username: credentialsWithoutMarks?.username,
      //       marks: userMarks
      //    };
      //    return credentials;
      // }
      // Delete Regular Customer mark and filter initial mark array.
      // else {
      //    await this.deleteMark(regCustMark.id);
      //    const credentials: UserCredentialsDto = {
      //       userDeliveryAddress: credentialsWithoutMarks?.userDeliveryAddress,
      //       username: credentialsWithoutMarks?.username,
      //       marks: userMarks.filter((mark) => mark.id !== regCustMark.id)
      //    };
      //    return credentials;
      // }
   }

   async updateUserRememberedDeliveryAddress(userId: number, deliveryDetails: DeliveryDetails): Promise<void> {
      const updated = {
         remembered_delivery_address: deliveryDetails
      };
      await this.userRepository.update(userId, updated);
   }

   async updateUsername(name: string, userId: number): Promise<void> {
      return this.userRepository.updateUsername(name, userId);
   }

   hasRegularCustomerMark(marks: Mark[]): Mark | null {
      for (const mark of marks) {
         if (mark.content === REGULAR_CUSTOMER_CONTENT) {
            return mark;
         }
      }
      return null;
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
         this.logger.info("Registering Super Admin");
         const ok = await this.userRepository.registerSuperAdmin(u);
         if (ok) {
            this.logger.info("Success");
         } else {
            this.logger.info("Fail. Super Admin already exists");
         }
      } catch (e) {
         this.logger.error("Fail");
         throw e;
      }
   }

   async loginMaster(b: LoginMasterUserDto): Promise<{ id: number; role: AppRoles; username: string }> {
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
         role: u.role,
         username: u.name
      };
   }

   async getWorkers(): Promise<MasterUser[]> {
      return this.userRepository.getWorkers();
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

   async authMe(userId: number): Promise<User> {
      const u = await this.userRepository.getById(userId);
      u.remembered_delivery_address = JSON.parse(u.remembered_delivery_address as unknown as string);
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
   async registerWorker(dto: CreateWorkerUserDto): Promise<User> {
      const { password } = dto;
      const hashedPass = await bcrypt.hash(password, 10);

      if (password.length < 8) {
         throw new PasswordIsTooShortException();
      }

      const user: User = {
         ...dto,
         password: hashedPass,
         role: AppRoles.worker
      };

      try {
         return this.userRepository.save(user);
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

   async getUserRole(user_id: number): Promise<AppRoles> {
      const user = (
         await this.userRepository.get({
            where: { id: user_id },
            returning: ["role"]
         })
      )[0];
      if (!user) throw new UserDoesNotExistException(user_id);

      return user.role;
   }

   async deleteMark(markId: number): Promise<void> {
      const ok = await this.markRepository.delete(markId);
      if (!ok) {
         throw new MarkDoesNotExist(markId);
      }
      return;
   }

   async createMark(dto: CreateMarkDto): Promise<Mark> {
      const ok = await this.markRepository.create(dto);
      if (!ok) {
         throw new DuplicateMark(dto.content);
      }
      return ok;
   }

   async findByNumberQuery(v: string): Promise<FoundUserDto[]> {
      if (v.trim().length === 0) {
         throw new ValidationErrorException();
      }
      const phoneNumberWithPlus = "+" + v;
      const raw = await this.userRepository.findByNumberQuery(phoneNumberWithPlus);
      return raw.map((u) => {
         //@ts-ignore for mapping purposes
         u.phoneNumber = u.phone_number;
         return u;
      });
   }
}
