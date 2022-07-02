import { Inject, Injectable } from "@nestjs/common";
import { MarkRepository } from "./mark.repository";
import { CreateMarkDto } from "./dto/create-mark.dto";
import { MarkDoesNotExist } from "../../shared/exceptions/mark.exceptions";

export interface MarkRepositoryInterface {
   create(dto: CreateMarkDto): Promise<void>;
   delete(userId: number, markId: number): Promise<boolean>;
}

@Injectable()
export class MarkService {
   constructor(private markRepository: MarkRepository) {}

   async create(dto: CreateMarkDto): Promise<void> {
      return this.markRepository.create(dto);
   }

   async delete(userId: number, markId: number): Promise<void> {
      const ok = await this.markRepository.delete(userId, markId);
      if (!ok) {
         throw new MarkDoesNotExist(markId, userId);
      }
      return;
   }
}
