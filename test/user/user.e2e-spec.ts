import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { UserModule } from "../../src/server/core/user/user.module";
import { UserService } from "../../src/server/core/user/user.service";
import { UserRepository } from "../../src/server/core/user/user.repository";
import { SessionService } from "../../src/server/core/session/session.service";
import { SessionRepository } from "../../src/server/core/session/session.repository";
import { Session } from "../../src/server/core/entities/Session";
import * as cookieParser from "cookie-parser";
import { User } from "../../src/server/core/entities/User";
import { AppRoles, OrderStatus } from "../../src/common/types";
import { OrderRepository } from "../../src/server/core/order/order.repository";
import { Order } from "../../src/server/core/entities/Order";

describe("UserController (e2e)", () => {
   let app: INestApplication;
   let userService: UserService;
   let userRepository: UserRepository;
   let sessionRepository: SessionRepository;
   let orderRepository: OrderRepository;

   const mockUserWithId = { id: 1 };
   const mockUsers = [mockUserWithId];

   const mockSession: Session = {
      session_id: "mock-session-id",
      user_id: 1
   };
   const mockSessions = [mockSession];
   const mockUser: User = {
      role: AppRoles.user,
      id: 2
   };

   beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [UserModule]
      }).compile();

      app = moduleFixture.createNestApplication();

      app.useGlobalPipes(new ValidationPipe());
      app.use(cookieParser());

      userService = moduleFixture.get<UserService>(UserService);
      sessionRepository = moduleFixture.get(SessionRepository);
      userRepository = moduleFixture.get(UserRepository);
      orderRepository = moduleFixture.get(OrderRepository);
      await app.init();
   });

   it("/login (POST) user is already in system -> 200code + SID. Doesnt call createUser", () => {
      jest.spyOn(userRepository, "get").mockImplementation(async () => mockUsers);
      jest.spyOn(sessionRepository, "get").mockImplementation(async () => mockSessions);
      jest.spyOn(userService, "createUser").mockImplementation(async () => mockUser);

      return request(app.getHttpServer())
         .post("/api/v1/users/login")
         .send({ phone_number: "+79524000770" })
         .expect(200)
         .then((res) => {
            const headers = res.headers;
            const cookieHeader = headers["set-cookie"];
            expect(userService.createUser).not.toHaveBeenCalled();
            expect(userRepository.get).toHaveBeenCalled();
            expect(sessionRepository.get).toHaveBeenCalled();
            expect(cookieHeader).not.toBeUndefined();
         });
   });
   it("/login (POST) user is not in system -> 201code + SID. Does call createUser", () => {
      const mockSession: Session = {
         session_id: "mock-session-id",
         user_id: 1
      };
      const mockUser: User = {
         role: AppRoles.user,
         id: 2
      };

      jest.spyOn(userRepository, "get").mockImplementation(async () => []);
      jest.spyOn(userRepository, "save").mockImplementation(async () => mockUser);
      jest.spyOn(sessionRepository, "save").mockImplementation(async () => mockSession);

      return request(app.getHttpServer())
         .post("/api/v1/users/login")
         .send({ phone_number: "+79524000775" })
         .expect(201)
         .then((res) => {
            const headers = res.headers;
            const cookieHeader = headers["set-cookie"];
            expect(userRepository.get).toHaveBeenCalled();
            expect(userRepository.save).toHaveBeenCalled();
            expect(cookieHeader).not.toBeUndefined();
            expect(sessionRepository.save).toHaveBeenCalled();
         });
   });
   it("/login (POST) should return 403. Called with SID already + has waiting order", () => {
      const mockSIDCookie = ["SID=ksdfhaSKDF*(&@MH!#K"];
      const mockOrder: Partial<Order> = {
         id: 2,
         status: OrderStatus.waiting_for_verification
      };
      jest.spyOn(sessionRepository, "get").mockImplementation(async () => mockSessions);
      jest.spyOn(orderRepository, "get").mockImplementation(async () => [mockOrder]);

      return request(app.getHttpServer())
         .post("/api/v1/users/login")
         .send({ phone_number: "+79524000770" })
         .set("Cookie", mockSIDCookie)
         .expect(403)
         .then((res) => {
            expect(sessionRepository.get).toHaveBeenCalled();
            expect(orderRepository.get).toHaveBeenCalled();
            expect(res.body).not.toBeUndefined();
         });
   });
});
