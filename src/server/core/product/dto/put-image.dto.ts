export class PutImageDto {
   productId: number;

   destination: string;

   ext: string = "png";
   file: Express.Multer.File;
}
