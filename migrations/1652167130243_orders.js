/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
   pgm.sql(`CREATE TYPE "pay" AS ENUM('onPickup','online')`);
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
         default: "{}"
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
      pay: {
         type: "pay",
         notNull: true
      }
   });
   pgm.createIndex("orders", "user_id");
   pgm.createIndex("orders", "status");
};

exports.down = (pgm) => {
   pgm.dropIndex("orders", "user_id");
   pgm.dropIndex("orders", "status");
   pgm.dropTable("orders");
   pgm.dropType("pay");
};
