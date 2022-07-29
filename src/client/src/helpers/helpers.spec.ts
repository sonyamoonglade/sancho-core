import { helpers } from "./helpers";

describe("helpers test", () => {
   const help = helpers;

   it("should sixify orderId", () => {
      const tt = [
         { id: 1, exp: "000001" },
         { id: 25, exp: "000025" },
         { id: 999999, exp: "999999" },
         { id: 48123, exp: "048123" },
         { id: 5134, exp: "005134" }
      ];
      for (const t of tt) {
         const actual = help.sixifyOrderId(t.id);
         expect(actual).toBe(t.exp);
      }
   });
});
