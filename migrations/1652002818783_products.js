/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
   pgm.createTable("products", {
      id: {
         type: "id",
         autoIncrement: true
      },
      category_id: {
         type: "integer",
         notNull: true,
         references: '"category"'
      },
      features: {
         type: "varchar(1000)",
         notNull: true
      },
      image_url: {
         type: "varchar(512)",
         notNull: false
      },
      name: {
         type: "varchar(255)",
         notNull: true,
         unique: true
      },
      translate: {
         type: "varchar(255)",
         notNull: true,
         unique: true
      },
      currency: {
         type: "varchar(10)",
         default: "₽"
      },
      price: {
         type: "double precision",
         notNull: true
      },
      description: {
         type: "varchar(1000)",
         notNull: false,
         default: null
      },
      has_image: {
         type: "boolean",
         notNull: true,
         default: false
      },
      approved: {
         type: "boolean",
         notNull: false,
         default: false
      }
   });
};

exports.down = (pgm) => {
   pgm.dropTable("products");
};
