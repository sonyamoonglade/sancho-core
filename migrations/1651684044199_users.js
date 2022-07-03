/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
   pgm.createTable("users", {
      id: {
         type: "id",
         autoIncrement: true
      },

      phone_number: {
         type: "varchar(255)",
         notNull: false,
         default: null,
         unique: true
      },
      role: {
         type: "varchar(100)",
         notNull: true
      },
      remembered_delivery_address: {
         type: "varchar(1000)",
         notNull: false,
         default: null
      },

      login: {
         type: "varchar(255)",
         notNull: false,
         default: null,
         unique: true
      },
      password: {
         type: "varchar(1000)",
         notNull: false,
         default: null
      },
      name: {
         type: "varchar(255)",
         notNull: true
      }
   });
   pgm.createIndex("users", "phone_number");
   pgm.createIndex("users", "id");
};

exports.down = (pgm) => {
   pgm.dropIndex("users", "phone_number");
   pgm.dropIndex("users", "id");
   pgm.dropTable("users", {
      cascade: true
   });
};
