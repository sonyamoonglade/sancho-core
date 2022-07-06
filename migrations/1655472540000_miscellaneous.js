/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
   pgm.createTable("misc", {
      id: {
         type: "integer",
         default: 1,
         unique: true
      },
      delivery_punishment_value: {
         type: "integer",
         notNull: true
      },
      delivery_punishment_threshold: {
         type: "integer",
         notNull: true
      },
      order_creation_delay: {
         type: "integer",
         notNull: true
      },
      reg_cust_threshold: {
         type: "integer",
         notNull: true
      },
      reg_cust_duration: {
         type: "integer",
         notNull: true
      }
   });
};

exports.down = (pgm) => {
   pgm.dropTable("misc");
};
