import { Inject, Injectable } from "@nestjs/common";
import { MarkRepository } from "./mark.repository";
import { CreateMarkDto } from "./dto/create-mark.dto";
import { MarkDoesNotExist } from "../../shared/exceptions/mark.exceptions";
import { Mark } from "../entities/Mark";
import { UserService } from "../user/user.service";

export interface MarkRepositoryInterface {
   create(dto: CreateMarkDto): Promise<void>;
   delete(userId: number, markId: number): Promise<boolean>;
   userMarks(userId: number): Promise<Mark[]>;
}

@Injectable()
export class MarkService {
   constructor(private markRepository: MarkRepository, private userService: UserService) {}

   async create(dto: CreateMarkDto): Promise<void> {
      const userId = await this.userService.getUserId(dto.phoneNumber);
      dto.userId = userId;
      return this.markRepository.create(dto);
   }

   async delete(userId: number, markId: number): Promise<void> {
      const ok = await this.markRepository.delete(userId, markId);
      if (!ok) {
         throw new MarkDoesNotExist(markId, userId);
      }
      return;
   }

   async userMarks(phoneNumber: string): Promise<Mark[]> {
      const phoneNumberWithPlus = "+" + phoneNumber;
      const userId = await this.userService.getUserId(phoneNumberWithPlus);
      return this.markRepository.userMarks(userId);
   }
}
