import { Test, TestingModule } from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from "../../src/server/core/user/user.module";
import {UserService} from "../../src/server/core/user/user.service";
import {UserRepository} from "../../src/server/core/user/user.repository";
import {SessionService} from "../../src/server/core/authentication/session.service";
import {SessionRepository} from "../../src/server/core/authentication/session.repository";
import {Session} from "../../src/server/core/entities/Session"
import * as cookieParser from "cookie-parser"
describe('User Controller (e2e)', () => {
    let app: INestApplication;
    let userService: UserService
    let userRepository: UserRepository
    let sessionService: SessionService
    let sessionRepository: SessionRepository
    beforeEach(async () => {
        // const qb = new QueryBuilder()
        // const db = new Pool()
        // userRepository = new UserRepository(qb,db)
        // sessionRepository = new SessionRepository(db,qb)
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UserModule],
        })
            .compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new ValidationPipe())
        app.use(cookieParser())

        userService = moduleFixture.get<UserService>(UserService)
        sessionRepository = moduleFixture.get(SessionRepository)
        userRepository = moduleFixture.get(UserRepository)
        await app.init();
    });

    it('/login (POST) user is already in system -> 200code + SID', () => {
        const mockUserWithId = {id:1}
        const mockUsers = [mockUserWithId]
        const mockSession:Session = {
            session_id: "mock-session-id", user_id: 1
        }
        const mockSessions = [mockSession]
        jest.spyOn(userRepository, ("get")).mockImplementation(async() => mockUsers)
        jest.spyOn(sessionRepository, ("get")).mockImplementation(async () => mockSessions)

        return request(app.getHttpServer())
            .post('/api/v1/users/login')
            .send({phone_number:"+79524000770"})
            .expect(200)
            .then(res => {
                const headers = res.headers
                const cookieHeader = headers["set-cookie"]
                expect(cookieHeader).not.toBeUndefined()
            })
    });
});
