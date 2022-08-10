import { Injectable } from "@nestjs/common";
import { PutImageDto } from "../../core/product/dto/put-image.dto";
import axios from "axios";
import {
  baseDestination,
  imagePNG,
  x_content_type,
  x_destination,
  x_file_name,
  x_root,
} from "../../../common/constants";
import { BinaryToTextEncoding } from "crypto";
import { ImageStorageInterface, PutFileResponse } from "./image_storage";
import { PinoLogger } from "nestjs-pino";
import { InvalidFileExtension } from "../exceptions/file.exceptions";
import { LambdaRouter } from "../lambdaRouter/lambdaRouter";

require("dotenv").config();

@Injectable()
export class ImageStorageService implements ImageStorageInterface {
   private readonly HASHING_ALGORITHM: string;
   private readonly ENCODING: BinaryToTextEncoding;
   constructor(private logger: PinoLogger, private lambdaRouter: LambdaRouter) {
      //todo: inject with config
      this.HASHING_ALGORITHM = "sha256";
      this.ENCODING = "hex";
      this.logger.setContext(ImageStorageService.name);
   }

   async deleteImageByRoot(root: string): Promise<void> {
      const x_headers = {
         [x_root]: root,
         [x_destination]: baseDestination
      };
      try {
         //Get lambda url
         const url = this.lambdaRouter.PseudoDelete();
         await axios.post<PutFileResponse>(url, null, {
            headers: {
               ...x_headers
            }
         });
         return;
      } catch (e: any) {
         // this.logger.error(e?.response);
         //todo: handle errors
         return;
      }
   }

   public validateFileExtension(mime: string, name: string): void {
      const validMime = imagePNG;
      const validExt = ".png";
      const ext = name.split(".").pop();
      if (mime !== validMime && ext !== validExt) {
         throw new InvalidFileExtension(mime);
      }
   }

   async putImage(dto: PutImageDto): Promise<string> {
      const filename = dto.productId + dto.ext;

      const x_headers = {
         [x_file_name]: filename,
         [x_destination]: dto.destination,
         [x_content_type]: imagePNG
      };
      //Get lambda url
      const url = this.lambdaRouter.PutImage();
      try {
         const { data } = await axios.post<PutFileResponse>(url, dto.file.buffer, {
            headers: {
               ...x_headers,
               "content-type": "application/octet-stream"
            }
         });
         return data.filename;
      } catch (e: any) {
         // this.logger.error(e?.response);
         //todo: function to handle errors
         return "";
      }
   }
}
