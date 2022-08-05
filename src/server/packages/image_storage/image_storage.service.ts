import { Injectable } from "@nestjs/common";
import { PutImageDto } from "../../core/product/dto/put-image.dto";
import axios from "axios";
import { x_destination, x_file_ext, x_file_name, x_hmac_signature } from "../../../common/constants";
import * as crypto from "crypto";
import { BinaryToTextEncoding } from "crypto";
import { ImageStorageInterface } from "./image_storage";
import { PinoLogger } from "nestjs-pino";
import { InvalidFileExtension } from "../exceptions/file.exceptions";

require("dotenv").config();

@Injectable()
export class ImageStorageService implements ImageStorageInterface {
   private readonly url: string;
   private readonly HASHING_ALGORITHM: string;
   private readonly ENCODING: BinaryToTextEncoding;

   constructor(private logger: PinoLogger) {
      //todo: inject with config
      this.url = process.env.FILE_SERVICE_URL;
      this.HASHING_ALGORITHM = "sha256";
      this.ENCODING = "hex";
      this.logger.setContext(ImageStorageService.name);
   }

   async deleteImage(id: number): Promise<boolean> {
      return Promise.resolve(false);
   }

   public validateFileExtension(mime: string, name: string): void {
      const validMime = "image/png";
      const validExt = ".png";
      const ext = name.split(".").pop();
      if (mime !== validMime && ext !== validExt) {
         throw new InvalidFileExtension(mime);
      }
   }

   async putImage(dto: PutImageDto, f: Express.Multer.File, productId: number): Promise<boolean> {
      const imagePNG = "image/png";

      dto.destination = "static/images/";
      dto.productId = productId;
      dto.file = f;

      const signature = this.generateSignature(dto);
      const secret = process.env.HASH_SECRET;
      const hmac = crypto.createHmac("sha256", secret).update(signature).digest(this.ENCODING);

      const x_headers = {
         [x_file_ext]: dto.ext,
         [x_file_name]: dto.productId,
         [x_destination]: dto.destination,
         [x_hmac_signature]: hmac,
         "content-type": imagePNG
      };

      const endPoint = "/api/v1/service/put";
      try {
         const { data } = await axios.post(this.url + endPoint, dto.file.buffer, {
            headers: {
               ...x_headers
            }
         });
         const ok = data.ok;

         return ok;
      } catch (e: any) {
         //todo: function to handle errors
         return false;
      }
   }

   generateSignature(dto: PutImageDto): string {
      const strForSignature = dto.ext + dto.productId + dto.destination;
      const hash = crypto.createHash(this.HASHING_ALGORITHM).update(strForSignature).digest(this.ENCODING);
      return hash;
   }
}
