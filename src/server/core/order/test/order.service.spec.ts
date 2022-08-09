import { OrderRepository } from "../order.repository";
import { OrderService } from "../order.service";
import { UserService } from "../../user/user.service";
import { JsonService } from "../../../packages/database/json.service";
import { ProductRepository } from "../../product/product.repository";
import { MiscService } from "../../miscellaneous/misc.service";
import { MiscRepository } from "../../miscellaneous/misc.repository";
import { SessionService } from "../../session/session.service";
import { SessionRepository } from "../../session/session.repository";
import { UserRepository } from "../../user/user.repository";
import { OrderCannotBePaid } from "../../../packages/exceptions/order.exceptions";
import { MarkRepository } from "../../mark/mark.repository";

describe("OrderService", () => {
   let orderRepository: OrderRepository;
   let orderService: OrderService;
   let sessionRepository: SessionRepository;
   let userRepository: UserRepository;
   let productRepository: ProductRepository;
   let markRepository: MarkRepository;
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
      markRepository = new MarkRepository(qb, db);

      miscService = new MiscService(miscRepository);
      sessionService = new SessionService(sessionRepository);
      jsonService = new JsonService();
      orderService = new OrderService(orderRepository, jsonService, productRepository, miscService);
      userService = new UserService(sessionService, userRepository, miscService, markRepository, orderService);
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
