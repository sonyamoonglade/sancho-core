/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
   pgm.createTable("marks", {
      id: {
         type: "id",
         autoIncrement: true
      },
      user_id: {
         type: "integer",
         references: '"users"',
         onDelete: "cascade",
         notNull: true
      },
      content: {
         type: "varchar(512)",
         notNull: true,
         unique: true
      },
      is_important: {
         type: "boolean",
         notNull: true
      },
      created_at: {
         type: "timestamp",
         notNull: true
      }
   });
};

exports.down = (pgm) => {
   pgm.dropTable("marks");
};
