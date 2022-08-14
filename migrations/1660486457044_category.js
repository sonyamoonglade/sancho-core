/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
   pgm.createTable("category", {
      category_id: {
         type: "id",
         autoIncrement: true
      },
      rank: {
         type: "integer",
         notNull: true //not unique because it fails on increment by one if unique
      },
      name: {
         type: "varchar(255)",
         notNull: true,
         unique: true
      }
   });
};

exports.down = (pgm) => {
   pgm.dropTable("category");
};
