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
import {User, users} from "../../src/server/core/entities/User";
import {Pool} from "pg";
import {QueryBuilder} from "../../src/server/core/query_builder/QueryBuilder";
import {SessionService} from "../../src/server/core/authentication/session.service";
import * as cookieParser from "cookie-parser"
import {AppModule} from "../../src/server/app.module";
import {ProductRepository} from "../../src/server/core/product/product.repository";
import {UserService} from "../../src/server/core/user/user.service";
import {VerifyOrderDto} from "../../src/server/core/order/dto/verify-order.dto";
import {CancelOrderDto} from "../../src/server/core/order/dto/cancel-order.dto";
import {CompleteOrderDto} from "../../src/server/core/order/dto/complete-order.dto";


describe('AppController (e2e)', () => {
    let app: INestApplication;
    let sessionService: SessionService
    let orderService: OrderService
    let userService: UserService

    let sessionRepository: SessionRepository
    let orderRepository: OrderRepository
    let userRepository:UserRepository
    let productRepository:ProductRepository

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
    const mockOrder:Order = {
        cart: mockCart,
        created_at: new Date(Date.now()),
        is_delivered: false,
        status: OrderStatus.waiting_for_verification,
        total_cart_price: 1500,
        user_id: mockUser.id,
    }


    const dto: CreateUserOrderDto = {
        cart:mockCart,
        is_delivered: false
    }
    // has just committed phone number in frontend
    const mockUserWhichDoesNotExistYet:User = {
        id: 6,
        phone_number: "+79898989898",
        role: AppRoles.user
    }
    const mockUserWhichDoesNotExistYetSession:Session= {
        user_id: 6,
        session_id: "mock_non_existing_session"
    }

    //@ts-ignore
    const p:SessionRepository = {
        qb: new QueryBuilder(),
        db: new Pool(),
        getById: async(SID) => {
            return mockSessions.find(s => s.session_id === SID)
        },

        async save(d): Promise<Session> {
            return mockSession
        }
    }
    //@ts-ignore
    const f:UserRepository = {
        qb: new QueryBuilder(),
        db: new Pool(),
        get: async(expression) =>  {
            if(expression.where.id === mockUser.id){
                return [mockUser]
            }else if(expression.where.phone_number === mockUserWhichDoesNotExistYet.phone_number){
                return []
            }
            return [mockWorkerUser]
        },
        save: async() => mockUserWhichDoesNotExistYet,
        update: async() => {}
    }
    //@ts-ignore
    const s:ProductRepository = {
        qb: new QueryBuilder(),
        db: new Pool(),
        customQuery: async(sd) => null
    }
    //@ts-ignore
    const j:OrderRepository = {
        qb: new QueryBuilder(),
        db: new Pool(),
        save: async() => {return {...mockOrder, id: 2}},
        get: async(expression) => null
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
        productRepository = moduleFixture.get(ProductRepository)

        app.use(cookieParser())

        await app.init();
    });

    it('/createUserOrder (POST) puts session of user which has got waiting order. Should return 400', async() => {

        const mockSIDCookie = [`SID=${mockSessionWithWaitingOrder.session_id}`]

        orderRepository.get = jest.fn(async () => [mockOrder])

        return request(app.getHttpServer())
            .post('/api/v1/order/createUserOrder')
            .set("Cookie",mockSIDCookie)
            .send(dto)
            .expect(400, {
                message: "Пожалуйста, подождите 5 минут(ы) для создания нового заказа или проследуйте инструкции",
                statusCode: 400
            })

    });
    it("/createUserOrder (POST) puts session of `fresh (0 waiting orders)` user. Should create order and return 201", async() =>   {
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

        productRepository.customQuery = jest.fn(async() => [mockProduct,mockProduct2])
        orderRepository.get = jest.fn(async () => [])


        jest.spyOn(userService,"updateUsersRememberedDeliveryAddress").mockImplementation(async() => {})
        jest.spyOn(sessionRepository, "getById")
        jest.spyOn(userRepository, "get")


        return request(app.getHttpServer())
            .post('/api/v1/order/createUserOrder')
            .set("Cookie",mockSIDCookie)
            .send(dto)
            .expect(201)
            .then( res => {
                const {order} = res.body
                order.created_at = mockOrder.created_at
                expect(order).toEqual(mockResponseOrder)

                //authorization middleware
                expect(userRepository.get).toHaveBeenCalled()

                // getting user_id from cookie SID
                expect(sessionRepository.getById).toHaveBeenCalled()

                //is_delivered = false -> doesnt exec
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

        productRepository.customQuery = jest.fn(async() => [mockProduct,mockProduct2])
        orderRepository.save = jest.fn(async () => mockOrder)
        sessionRepository.save = jest.fn(async () => mockSession)
        orderRepository.get = jest.fn(async () => [])


        jest.spyOn(userRepository,"get")
        jest.spyOn(userRepository, "save")
        jest.spyOn(userService,"createUser")
        jest.spyOn(userService,"updateUsersRememberedDeliveryAddress")
        jest.spyOn(sessionRepository, "save")
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

                //saving order
                expect(orderRepository.save).toHaveBeenCalled()
                //authorization middleware
                expect(userRepository.get).toHaveBeenCalled()

                expect(userRepository.save).not.toHaveBeenCalled()
                expect(userService.createUser).not.toHaveBeenCalled()
                expect(userService.updateUsersRememberedDeliveryAddress).not.toHaveBeenCalled()

                //not saving session (user is already in!)
                expect(sessionRepository.save).not.toHaveBeenCalled()
            })
    })
    it("/createMasterOrder (POST) user is not in system. Should createUser(exec userRepo.save). Expect 201", () => {

        //applying phone number which is not in database yet. Just in time phone-call
        const dto:CreateMasterOrderDto = {
            cart: mockCart,
            is_delivered: true,
            delivery_details: {
              address: "check_Address",
              floor: 1,
              flat_call: 2,
              entrance_number: 3
            },
            phone_number: mockUserWhichDoesNotExistYet.phone_number,
            verified_fullname: "Artem Alexandrovich"
        }
        //but using worker session id to even make a request
        const mockSIDCookie = [`SID=${mockWorkerSession.session_id}`]

        userRepository.save = jest.fn(async() => mockUserWhichDoesNotExistYet)
        sessionRepository.save = jest.fn(async() => mockSessionWithWaitingOrder)
        productRepository.customQuery = jest.fn(async() => [mockProduct,mockProduct2])
        orderRepository.get = jest.fn(async () => [])


        jest.spyOn(userRepository,"save")
        jest.spyOn(userRepository,"get")
        jest.spyOn(userRepository,"update")
        jest.spyOn(userService,"updateUsersRememberedDeliveryAddress")

        jest.spyOn(sessionService, "attachCookieToResponse")
        jest.spyOn(sessionRepository,"save")

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
                expect(order.is_delivered).toBeTruthy()
                expect(order.delivery_details).not.toBeNull()
                expect(order.total_cart_price).toBe(mockTotalCartPrice)
                expect(sessionService.attachCookieToResponse).not.toHaveBeenCalled()

                expect(orderRepository.save).toHaveBeenCalled()
                //authorization middleware
                expect(userRepository.get).toHaveBeenCalled()

                //saving session call
                expect(sessionRepository.save).toHaveBeenCalled()
                //createUser call
                expect(userRepository.save).toHaveBeenCalled()
                // should call update because dto.delivery_details is not null + is_delivered = true
                expect(userRepository.update).toHaveBeenCalled()
                expect(userRepository.update).toHaveBeenCalledWith(mockUserWhichDoesNotExistYet.id,{
                    remembered_delivery_address : JSON.stringify(dto.delivery_details)
                })
            })
    })
    it("/verify (PUT) tries to verify fresh user's order (0 waiting orders) should return 400", () => {

        const dto:VerifyOrderDto =  {
            phone_number: mockUser.phone_number,
            verified_fullname: "Kirill Simonov"
        }

        const mockSIDCookie = [`SID=${mockWorkerSession.session_id}`]

        orderRepository.customQuery = jest.fn(async() => [])
        orderRepository.update = jest.fn(async() => {})

        jest.spyOn(orderRepository, "customQuery")
        jest.spyOn(orderRepository, "update")
        jest.spyOn(orderService, "hasWaitingOrder")

        return request(app.getHttpServer())
            .put('/api/v1/order/verify')
            .set("Cookie",mockSIDCookie)
            .send(dto)
            .expect(400, {
                statusCode: 400,
                message: `Все заказы по номеру ${mockUser.phone_number} подтверждены!`
            })
            .then(res => {
                expect(orderRepository.customQuery).toHaveBeenCalled()
                expect(orderService.hasWaitingOrder).toHaveBeenCalledWith(null, mockUser.phone_number)
                expect(orderRepository.update).not.toHaveBeenCalled()
            })
    })
    it("/verify (PUT) tries to verify user's order (1 waiting order). Should return 200", () => {

        const mockSIDCookie = [`SID=${mockWorkerSession.session_id}`]

        const dto:VerifyOrderDto = {
            phone_number: mockUserWithWaitingOrder.phone_number,
            verified_fullname: "Dmitri Dmitri"
        }

        orderRepository.customQuery = jest.fn(async() => [mockOrder])
        orderRepository.update = jest.fn(async() => {})

        jest.spyOn(orderRepository, "customQuery")
        jest.spyOn(orderRepository, "update")
        jest.spyOn(orderService, "hasWaitingOrder")

        return request(app.getHttpServer())
            .put('/api/v1/order/verify')
            .set("Cookie",mockSIDCookie)
            .send(dto)
            .expect(200)
            .then(res => {

                const {status} = res.body
                expect(status).toBe(OrderStatus.verified)

                expect(orderRepository.customQuery).toHaveBeenCalled()
                expect(orderService.hasWaitingOrder).toHaveBeenCalledWith(null, mockUserWithWaitingOrder.phone_number)

                //verify order on db
                expect(orderRepository.update).toHaveBeenCalled()
            })
    })
    it("/cancel (PUT) user cancels order (no cancel_ban). Should return 200 + ban cookie", () => {

        const dto:CancelOrderDto = {
            order_id: 3, //some mock order_id
            cancel_explanation: "mock_string"
        }

        const mockSIDCookie = [`SID=${mockSession.session_id}`]

        orderRepository.getById = jest.fn(async() => mockOrder)
        orderRepository.update = jest.fn(async() => {})

        jest.spyOn(orderRepository,"getById")
        jest.spyOn(orderRepository,"update")

        return request(app.getHttpServer())
            .put('/api/v1/order/cancel')
            .send(dto)
            .set("Cookie",mockSIDCookie)
            .expect(200)
            .then(res => {
                //cancelling order
                expect(orderRepository.update).toHaveBeenCalled()

                //getting real order by id
                expect(orderRepository.getById).toHaveBeenCalled()

                //checking if the ban has applied
                const headers = res.headers
                const setCookie = headers["set-cookie"]
                const banCookie = setCookie[0]
                expect(banCookie).not.toBeUndefined()


            })
    })
    it("/cancel (PUT) user cancels order (with cancel_ban) should return 403", () => {

        const dto:CancelOrderDto = {
            order_id: 3, // some mock order_id
            cancel_explanation: "mock_string"
        }

        const mockSIDCookie = [`SID=${mockSession.session_id}`, `cancel_ban=true`]

        return request(app.getHttpServer())
            .put('/api/v1/order/cancel')
            .set("Cookie",mockSIDCookie)
            .send(dto)
            .expect(403)
    })
    it("/complete (PUT) Order status given by order_id *IS NOT* verified. Should return 400", () =>{

        const dto: CompleteOrderDto = {
            order_id: 3 // mock order_Id
        }
        const mockSIDCookie = [`SID=${mockWorkerSession.session_id}`]

        // return 0 verified orders by given order_id
        orderRepository.get = jest.fn(async() => [])
        jest.spyOn(orderRepository,"get")

        return request(app.getHttpServer())
            .put('/api/v1/order/complete')
            .set("Cookie",mockSIDCookie)
            .send(dto)
            .expect(400)
            .then(res => {

                const body = res.body
                expect(body.message).toBe(`Статус заказа - ${dto.order_id} НЕ подтвержден!`)

                expect(orderRepository.get).toHaveBeenCalled()



            })
    })
    it("/complete (PUT) Order status given by order_id *IS* verified. Should return 200", () => {

        const dto: CompleteOrderDto = {
            order_id: 3 // mock order_Id
        }
        const mockSIDCookie = [`SID=${mockWorkerSession.session_id}`]


        // return 0 verified orders by given order_id
        orderRepository.get = jest.fn(async() => [mockOrder])
        orderRepository.update = jest.fn(async() => {})

        jest.spyOn(orderRepository,"get")
        jest.spyOn(orderRepository, "update")

        return request(app.getHttpServer())
            .put('/api/v1/order/complete')
            .set("Cookie",mockSIDCookie)
            .send(dto)
            .expect(200)
            .then(res => {

                const body = res.body
                expect(body).toEqual({status: OrderStatus.completed})

                expect(orderRepository.get).toHaveBeenCalled()
                expect(orderRepository.update).toHaveBeenCalled()

            })

    })
});
