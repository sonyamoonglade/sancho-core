import { PutImageDto } from "../../core/product/dto/put-image.dto";

export interface ImageStorageInterface {
   putImage(dto: PutImageDto, f: Express.Multer.File, productId: number): Promise<boolean>;
   deleteImage(id: number): Promise<boolean>;
}
