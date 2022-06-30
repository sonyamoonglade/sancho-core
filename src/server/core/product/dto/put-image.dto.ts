export class PutImageDto {
   productId: number;

   destination: string;

   file: Express.Multer.File;

   sessionId: string;
}
