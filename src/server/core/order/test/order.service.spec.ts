import { OrderRepository } from "../order.repository";
import { OrderService } from "../order.service";
import { UserService } from "../../user/user.service";
import { JsonService } from "../../../shared/database/json.service";
import { ProductRepository } from "../../product/product.repository";
import { MiscService } from "../../miscellaneous/misc.service";
import { MiscRepository } from "../../miscellaneous/misc.repository";
import { SessionService } from "../../authentication/session.service";
import { SessionRepository } from "../../authentication/session.repository";
import { UserRepository } from "../../user/user.repository";
import { OrderCannotBePaid } from "../../../shared/exceptions/order.exceptions";

describe("OrderService", () => {
   let orderRepository: OrderRepository;
   let orderService: OrderService;
   let sessionRepository: SessionRepository;
   let userRepository: UserRepository;
   let productRepository: ProductRepository;
   let miscRepository: MiscRepository;
   let sessionService: SessionService;
   let userService: UserService;
   let jsonService: JsonService;
   let miscService: MiscService;
   const qb = null;
   const db = null;

   beforeEach(() => {
      orderRepository = new OrderRepository(qb, db);
      sessionRepository = new SessionRepository(qb, db);
      userRepository = new UserRepository(qb, db);
      productRepository = new ProductRepository(qb, db);
      miscRepository = new MiscRepository(qb, db);

      sessionService = new SessionService(sessionRepository);
      userService = new UserService(sessionService, userRepository);
      jsonService = new JsonService();
      miscService = new MiscService(miscRepository);

      orderService = new OrderService(orderRepository, userService, jsonService, productRepository, miscService);
   });

   it("should throw OrderCannotBePaid (because status != completed)", async () => {
      //op fails
      orderRepository.payForOrder = jest.fn(async () => false);

      jest.spyOn(orderRepository, "payForOrder");

      const orderId = 5;

      try {
         const actual = await orderService.payForOrder(orderId);
      } catch (e) {
         expect(e).toBeInstanceOf(OrderCannotBePaid);
         expect(orderRepository.payForOrder).toHaveBeenCalledWith(orderId);
         expect(orderRepository.payForOrder).toHaveBeenCalled();
      }
   });
   it("should return void (operation is successfull)", async () => {
      // op successfull
      orderRepository.payForOrder = jest.fn(async () => true);

      jest.spyOn(orderRepository, "payForOrder");

      const orderId = 5;

      try {
         const actual = await orderService.payForOrder(orderId);
         expect(orderRepository.payForOrder).toHaveBeenCalledWith(orderId);
         expect(orderRepository.payForOrder).toHaveBeenCalled();
         expect(actual).toBeUndefined();
      } catch (e) {}
   });
});
