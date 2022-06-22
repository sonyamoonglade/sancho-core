import { Injectable } from "@nestjs/common";
import { MiscRepository } from "./misc.repository";
import { Miscellaneous } from "../../types/types";
import { SetMiscDto } from "./dto/set-misc.dto";

@Injectable()
export class MiscService {
   constructor(private miscRepository: MiscRepository) {}

   public async getAllValues(): Promise<Miscellaneous> {
      const misc = await this.miscRepository.getAll();
      return misc;
   }

   public async init(dto: SetMiscDto): Promise<void> {
      await this.miscRepository.init(dto);
      return;
   }

   public async update(dto: SetMiscDto): Promise<void> {
      await this.miscRepository.update(dto);
      return;
   }
}
