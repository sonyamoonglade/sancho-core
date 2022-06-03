import {Test, TestingModule} from '@nestjs/testing';
import {OrderService} from '../order.service';
import {ValidationService} from "../../validation/validation.service";
import {OrderRepository} from "../order.repository";
import {UserService} from "../../user/user.service";
import {JsonService} from "../../database/json.service";
import {DbModule} from "../../database/db.module";
import {QueryBuilderModule} from "../../query_builder/qb.module";
import {DatabaseCartProduct} from "../../../../common/types";
import {SessionService} from "../../authentication/session.service";
import {UserRepository} from "../../user/user.repository";
import {SessionRepository} from "../../authentication/session.repository";
import {OrderAntiSpamMiddleware} from "../middleware/order.anti-spam.middleware";
import {ProductRepository} from "../../product/product.repository";

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: OrderRepository
  let productRepository: ProductRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService, UserService, ValidationService,
        OrderRepository, SessionService, UserRepository,
        SessionRepository,JsonService,OrderAntiSpamMiddleware,
        ProductRepository
      ],
      imports:[DbModule,QueryBuilderModule]
    }).compile();

    orderService = module.get(OrderService);
    orderRepository = module.get(OrderRepository)
    productRepository = module.get(ProductRepository)
  });

  describe("cart manipulations", () => {

    it('should show sql', async () => {
      const mockCart:DatabaseCartProduct[] = [
        {id:1,price:156,translate:'pizza',quantity:3},
        {id:2,price:214,translate:'water',quantity:1},
        {id:3,price:216,translate:'bubble',quantity:1},
      ]
      const mockRepoReturn = [
        {price: 156, id: 1},
        {price: 214, id: 2},
        {price: 216, id: 3}
      ]
      jest.spyOn(productRepository,'customQuery').mockImplementation(async() => mockRepoReturn)
      const expectedPrice = mockCart.reduce((a,c) => {
        a += c.price * c.quantity
        return a
      },0)
      const actual = await orderService.calculateTotalCartPrice(mockCart)
      expect(actual).toEqual(expectedPrice)
    })

  })



});
