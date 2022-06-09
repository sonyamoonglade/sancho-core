import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import {CreateMasterOrderDto, CreateUserOrderDto} from "../../src/server/core/order/dto/create-order.dto";
import {
    AppRoles,
    Categories,
    DatabaseCartProduct,
    OrderStatus,
    Product,
    ResponseUserOrder
} from "../../src/common/types";
import {Order} from "../../src/server/core/entities/Order";
import {OrderService} from "../../src/server/core/order/order.service";
import {OrderRepository} from "../../src/server/core/order/order.repository";
import {UserRepository} from "../../src/server/core/user/user.repository";
import {SessionRepository} from "../../src/server/core/authentication/session.repository";
import {Session} from "../../src/server/core/entities/Session";
import {User} from "../../src/server/core/entities/User";
import {Pool} from "pg";
import {QueryBuilder} from "../../src/server/core/query_builder/QueryBuilder";
import {SessionService} from "../../src/server/core/authentication/session.service";
import * as cookieParser from "cookie-parser"
import {AppModule} from "../../src/server/app.module";
import {ProductRepository} from "../../src/server/core/product/product.repository";
import {UserService} from "../../src/server/core/user/user.service";


describe('AppController (e2e)', () => {
    let app: INestApplication;
    let sessionService: SessionService
    let orderService: OrderService
    let userService: UserService

    let sessionRepository: SessionRepository
    let orderRepository: OrderRepository
    let userRepository:UserRepository

    const mockDBProduct:DatabaseCartProduct = {
        quantity:1,
        id:1,
        translate:"mozarella",
        category:Categories.PIZZA,
        price: 400
    }
    const mockDBProduct2:DatabaseCartProduct = {
        quantity:2,
        id:2,
        translate:"mozarella",
        category:Categories.PIZZA,
        price: 500
    }

    const mockTotalCartPrice = (500 * 2 )+ 400

    const mockProduct:Product = {
        id:1,
        translate:"mozarella",
        category: Categories.PIZZA,
        price: 400,
        description:"sd",
        name:"s",
        features:{
            weight:22
        },
        currency:"p"
    }
    const mockProduct2:Product = {
        id:2,
        translate:"mozarella",
        category: Categories.PIZZA,

        price: 500,
        description:"sd",
        name:"s",
        features:{
            weight:22
        },
        currency:"p"
    }

    const mockCart = [mockDBProduct,mockDBProduct2]

    const mockSession:Session = {
        user_id: 1,
        session_id: "mock_session_id"
    }
    const mockUser:User = {
        role: AppRoles.user,
        id: 1,
        phone_number: "+79524000770"
    }

    const mockWorkerSession:Session = {
        user_id: 3,
        session_id: "mock_session_id_worker"
    }
    const mockWorkerUser:User = {
        login: "aalexandr",
        password:"mock",
        id: 4,
        role: AppRoles.worker
    }

    const mockSessionWithWaitingOrder:Session = {
        user_id: 2,
        session_id: "mock_session_id_diff"
    }
    const mockUserWithWaitingOrder:User = {
        id: 2,
        role: AppRoles.user,
        phone_number: "+79524050770"
    }

    const mockSessions = [
        mockSession,
        mockSessionWithWaitingOrder,
        mockWorkerSession
    ]

    const workerUser: User = {
        login: "aalex",
        password: "aalexa1",
        id:3,
        role: AppRoles.worker
    }
    const mockOrder:Order = {
        cart: mockCart,
        created_at: new Date(Date.now()),
        is_delivered: false,
        status: OrderStatus.waiting_for_verification,
        total_cart_price: 1500,
        user_id: 2,
    }


    const dto: CreateUserOrderDto = {
        cart:mockCart,
        is_delivered: false
    }
    //@ts-ignore
    const p:SessionRepository = {
        qb: new QueryBuilder(),
        db: new Pool(),
        getById: async(SID) => {
            return mockSessions.find(s => s.session_id === SID)
        }
    }
    //@ts-ignore
    const f:UserRepository = {
        qb: new QueryBuilder(),
        db: new Pool(),
        get: async(expression) =>  {
            if(expression.where.id === mockUser.id){
                return [mockUser]
            }
            return [workerUser]
        }
    }
//@ts-ignore
    const s:ProductRepository = {
        qb: new QueryBuilder(),
        db: new Pool(),
        customQuery: async(sd) => [mockProduct,mockProduct2]
    }
//@ts-ignore

    const j:OrderRepository = {
        qb: new QueryBuilder(),
        db: new Pool(),
        save: async() => {return {...mockOrder, id: 2}},
        get: async(expression) => {
            if(expression.where.user_id === mockUserWithWaitingOrder.id){ return[mockOrder] }
            return []
        }
    }


    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(SessionRepository)
            .useValue(p)
            .overrideProvider(UserRepository)
            .useValue(f)
            .overrideProvider(ProductRepository)
            .useValue(s)
            .overrideProvider(OrderRepository)
            .useValue(j)
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe())

        sessionService = moduleFixture.get(SessionService)
        orderService = moduleFixture.get(OrderService)
        userService = moduleFixture.get(UserService)

        sessionRepository = moduleFixture.get(SessionRepository)
        userRepository = moduleFixture.get(UserRepository)
        orderRepository = moduleFixture.get(OrderRepository)

        app.use(cookieParser())

        await app.init();
    });




    it('/createUserOrder (POST) puts session of user which has got waiting order. Should return 400', async() => {

        const mockSIDCookie = [`SID=${mockSessionWithWaitingOrder.session_id}`]


        return request(app.getHttpServer())
            .post('/api/v1/order/createUserOrder')
            .set("Cookie",mockSIDCookie)
            .send(dto)
            .expect(400, {
                message: "Пожалуйста, подождите 5 минут(ы) для создания нового заказа или проследуйте инструкции",
                statusCode: 400
            })

    });
    it("/createUserOrder (POST) puts session of `fresh` user. Should create order and return 201", async() =>   {
        const mockSIDCookie = [`SID=${mockSession.session_id}`]

        const mockResponseOrder:ResponseUserOrder = {
            id: 2,
            cart: mockOrder.cart,
            created_at: mockOrder.created_at,
            status: mockOrder.status,
            is_delivered: mockOrder.is_delivered,
            delivery_details: mockOrder.delivery_details ? mockOrder.delivery_details : null,
            total_cart_price: mockTotalCartPrice
        }
        jest.spyOn(userService,"updateUsersRememberedDeliveryAddress").mockImplementation(async() => {})
        jest.spyOn(sessionRepository, "getById")
        return request(app.getHttpServer())
            .post('/api/v1/order/createUserOrder')
            .set("Cookie",mockSIDCookie)
            .send(dto)
            .expect(201)
            .then( res => {
                const {order} = res.body
                order.created_at = mockOrder.created_at
                expect(order).toEqual(mockResponseOrder)
                expect(sessionRepository.getById).toHaveBeenCalled()
                expect(userService.updateUsersRememberedDeliveryAddress).not.toHaveBeenCalled()
            })
    })

    it("/createMasterOrder (POST) user is already in system. Should not createUser. Expect 201", () => {
        const dto:CreateMasterOrderDto = {
            cart: mockCart,
            is_delivered: false,
            phone_number: "+79128507000",
            verified_fullname: "Artem Alexandrovich"
        }

        const mockSIDCookie = [`SID=${mockWorkerSession.session_id}`]
        jest.spyOn(userRepository,"get")
        jest.spyOn(userService,"createUser")
        jest.spyOn(userService,"updateUsersRememberedDeliveryAddress")
        jest.spyOn(orderRepository,"save")

        return request(app.getHttpServer())
            .post('/api/v1/order/createMasterOrder')
            .set("Cookie",mockSIDCookie)
            .send(dto)
            .expect(201)
            .then(res => {

                const {order} = res.body
                expect(order.verified_fullname).toBe(dto.verified_fullname)
                expect(order.cart).toHaveLength(dto.cart.length)
                expect(order.status).toBe(OrderStatus.verified)

                expect(orderRepository.save).toHaveBeenCalled()
                expect(userRepository.get).toHaveBeenCalled()
                expect(userService.createUser).not.toHaveBeenCalled()
                expect(userService.updateUsersRememberedDeliveryAddress).not.toHaveBeenCalled()
            })

    })
});
