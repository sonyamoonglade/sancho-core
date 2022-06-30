import { Injectable } from "@nestjs/common";
import { FileStorageInterface } from "../../core/product/product.service";
import { PutImageDto } from "../../core/product/dto/put-image.dto";
import axios from "axios";
import { x_destination, x_file_ext, x_file_name, x_session_id } from "../../../common/constants";

require("dotenv").config();

@Injectable()
export class FileStorage implements FileStorageInterface {
   private url: string = process.env.FILE_STORAGE_URL;

   async deleteImage(id: number): Promise<boolean> {
      return Promise.resolve(false);
   }

   async putImage(dto: PutImageDto, f: Express.Multer.File, productId: number): Promise<boolean> {
      const imagePNG = "image/png";

      dto.destination = "static/images/";
      dto.productId = productId;
      dto.file = f;

      const x_headers = {
         [x_file_ext]: "png",
         [x_file_name]: dto.productId,
         [x_session_id]: dto.sessionId,
         [x_destination]: dto.destination,
         "content-type": imagePNG
      };

      const endPoint = "/service/put";
      try {
         const { data } = await axios.post(this.url + endPoint, dto.file.buffer, {
            headers: {
               ...x_headers
            }
         });
         const ok = data?.ok || false;
         return ok;
      } catch (e) {
         return false;
      }
   }
}
