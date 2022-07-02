import { MarkService } from "../mark.service";
import { MarkRepository } from "../mark.repository";
import { CreateMarkDto } from "../dto/create-mark.dto";
import { MarkDoesNotExist } from "../../../shared/exceptions/mark.exceptions";

describe("MarkService", () => {
   let markService: MarkService;
   let markRepository: MarkRepository;
   beforeEach(() => {
      markRepository = new MarkRepository(null, null);

      markService = new MarkService(markRepository);
   });

   it("should create mark and return void", async () => {
      markRepository.create = jest.fn(async () => {});

      jest.spyOn(markRepository, "create");

      const dto: CreateMarkDto = {
         content: "mock",
         isImportant: true,
         userId: 1
      };

      const actual = await markService.create(dto);

      expect(actual).toBeUndefined();
      expect(markRepository.create).toHaveBeenCalled();
      expect(markRepository.create).toHaveBeenCalledWith(dto);
   });

   it("should throw exception because mark does not exist on such user", async () => {
      //imitating zero returned id's (mark doesnt exist)
      markRepository.delete = jest.fn(async () => false);

      jest.spyOn(markRepository, "delete");

      const userId: number = 1;
      const markId: number = 2;

      try {
         const actual = await markService.delete(userId, markId);
         expect(markRepository.delete).toHaveBeenCalled();
      } catch (e) {
         expect(e).toBeInstanceOf(MarkDoesNotExist);
      }
   });
   it("should delete mark and return void", async () => {
      //imitating that mark has been deleted
      markRepository.delete = jest.fn(async () => true);

      jest.spyOn(markRepository, "delete");

      const userId: number = 1;
      const markId: number = 2;

      try {
         const actual = await markService.delete(userId, markId);
         expect(actual).toBeUndefined();
         expect(markRepository.delete).toHaveBeenCalled();
      } catch (e) {}
   });
});
