import {Injectable} from '@nestjs/common';
import {FileTypes} from "../types/types";

import * as path from 'path'
import * as fs from 'fs'
import {mkdirSync} from 'fs'
import {FileDoesNotExist, FileUploadErrorException} from "../exceptions/file.exceptions";

@Injectable()
export class FileService {

  private readonly staticFolderPath;

  constructor() {
    this.staticFolderPath = path.resolve(__dirname, "..","..","static")
  }

//TODO: LOGGING

  writeFile(file: any, type: FileTypes, id: number):string{

    const typeFolderPath = path.join(this.staticFolderPath,`${type}s`)

    const fileExtension = file.originalname.split('.').pop()
    const fileName = `${id.toString()}.${fileExtension}`

    const filePath = path.join(typeFolderPath,fileName)

    try {

      FileService.createFolderIfNotExist(typeFolderPath)

      fs.writeFileSync(path.resolve(filePath),file.buffer)

      const staticFilePathWithName = path.join(`${type}s`,fileName)

      return staticFilePathWithName

    }catch (e) {
      throw new FileUploadErrorException(fileName,id)
    }


  }

  changeFileById(id: number, newFile: any, type: FileTypes): string{
    // check wheteher file exist
    const fileExtension = newFile.originalname.split('.').pop()
    const fileName = `${id}.${fileExtension}`

    const typeFolderPath = path.join(this.staticFolderPath,`${type}s`)
    const filePath = path.join(typeFolderPath,fileName)

    FileService.createFolderIfNotExist(typeFolderPath)

    if(!fs.existsSync(filePath)) throw new FileDoesNotExist(fileName)

    try {
      fs.rmSync(filePath)
      fs.writeFileSync(path.resolve(filePath),newFile.buffer)

      const staticFilePathWithName = path.join(`${type}s`,fileName)

      return staticFilePathWithName

    }catch (e) {
      throw new FileUploadErrorException(fileName,id)
    }



  }

  private static createFolderIfNotExist(path){
    if(!fs.existsSync(path)){
      mkdirSync(path,{recursive: true})
    }
  }




}
