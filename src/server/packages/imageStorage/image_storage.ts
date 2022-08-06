import { PutImageDto } from "../../core/product/dto/put-image.dto";

export interface ImageStorageInterface {
   putImage(dto: PutImageDto): Promise<string>;
   deleteImageByRoot(root: string): Promise<void>;
}

export interface PutFileResponse {
   filename: string; //name of created file(e.g. 11_1642123123.png)
}
