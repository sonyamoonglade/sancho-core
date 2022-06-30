import { Module } from "@nestjs/common";
import { FileStorage } from "./file.storage";

@Module({
   providers: [FileStorage]
})
export class FileStorageModule {}
