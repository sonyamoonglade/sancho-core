/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
   pgm.createTable("marks", {
      id: {
         type: "integer",
         authIncrement: true
      },
      user_id: {
         type: "integer",
         references: "'users'",
         onDelete: "cascade",
         notNull: true
      },
      content: {
         type: "varchar(512)",
         notNull: true
      },
      is_important: {
         type: "boolean",
         notNull: true
      }
   });
};

exports.down = (pgm) => {};
