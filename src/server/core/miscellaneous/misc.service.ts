import { Injectable } from "@nestjs/common";
import { MiscRepository } from "./misc.repository";
import { InitMiscDto } from "./dto/init-misc.dto";
import { Miscellaneous } from "../entities/Miscellaneous";

@Injectable()
export class MiscService {
   constructor(private miscRepository: MiscRepository) {}

   public async getAllValues(): Promise<Miscellaneous> {
      const misc = await this.miscRepository.getAll();
      return misc;
   }

   public async init(dto: InitMiscDto): Promise<void> {
      await this.miscRepository.init(dto);
      return;
   }

   public async update(dto: InitMiscDto): Promise<void> {
      await this.miscRepository.update(dto);
      return;
   }
}
