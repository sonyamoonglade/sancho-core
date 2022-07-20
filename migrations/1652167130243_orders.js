/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
   pgm.sql(`CREATE TYPE "pay" AS ENUM('cash','withCard','paid')`);
   pgm.createTable("orders", {
      id: {
         type: "id",
         autoIncrement: true
      },
      user_id: {
         type: "int",
         references: '"users"',
         onDelete: "Cascade",
         notNull: true
      },
      cart: {
         type: "varchar[]",
         notNull: true
      },
      status: {
         type: "varchar(100)",
         notNull: true
      },
      total_cart_price: {
         type: "real",
         notNull: true
      },
      is_delivered: {
         type: "boolean",
         notNull: true
      },

      is_delivered_asap: {
         type: "boolean",
         notNull: true
      },
      delivery_details: {
         type: "json",
         notNull: false,
         default: "'{}::json'"
      },
      created_at: {
         type: "timestamp",
         notNull: true
      },
      verified_at: {
         type: "timestamp",
         notNull: false,
         default: null
      },
      completed_at: {
         type: "timestamp",
         notNull: false,
         default: null
      },
      cancelled_at: {
         type: "timestamp",
         notNull: false,
         default: null
      },
      cancelled_by: {
         type: "int",
         references: '"users"',
         onDelete: "Cascade",
         notNull: false,
         default: null
      },
      cancel_explanation: {
         type: "varchar(1000)",
         notNull: false,
         default: null
      },
      is_paid: {
         type: "boolean",
         notNull: true,
         default: false
      },
      pay: {
         type: "pay",
         notNull: true
      }
   });
   pgm.createIndex("orders", "user_id");
   pgm.createIndex("orders", "status");
   pgm.createIndex("orders", "is_paid");
};

exports.down = (pgm) => {
   pgm.dropConstraint("orders", "orders_user_id_fkey");
   pgm.dropConstraint("orders", "orders_cancelled_by_fkey");
   pgm.dropIndex("orders", "user_id");
   pgm.dropIndex("orders", "status");
   pgm.dropIndex("orders", "is_paid");
   pgm.dropTable("orders");
   pgm.dropType("pay");
};
