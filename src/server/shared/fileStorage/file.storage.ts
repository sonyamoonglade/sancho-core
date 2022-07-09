import { Injectable } from "@nestjs/common";
import { FileStorageInterface } from "../../core/product/product.service";
import { PutImageDto } from "../../core/product/dto/put-image.dto";
import axios from "axios";
import { x_destination, x_file_ext, x_file_name, x_hmac_signature } from "../../../common/constants";
import * as crypto from "crypto";
import { BinaryToTextEncoding } from "crypto";
require("dotenv").config();

@Injectable()
export class FileStorage implements FileStorageInterface {
   private url: string = process.env.FILE_STORAGE_URL;

   private HASHING_ALGORITHM: string = "sha256";
   private ENCODING: BinaryToTextEncoding = "hex";

   async deleteImage(id: number): Promise<boolean> {
      return Promise.resolve(false);
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
         return false;
      }
   }

   generateSignature(dto: PutImageDto): string {
      const strForSignature = dto.ext + dto.productId + dto.destination;
      const hash = crypto.createHash(this.HASHING_ALGORITHM).update(strForSignature).digest(this.ENCODING);
      return hash;
   }
}
