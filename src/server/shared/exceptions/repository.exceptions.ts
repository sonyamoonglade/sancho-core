import { HttpException, HttpStatus } from "@nestjs/common";

export class RepositoryException extends HttpException {
   constructor(repoName: string, error: string) {
      super(`В ${repoName} произошла ошибка. ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
   }
}
