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
         type: "varchar(255)",
         notNull: true
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
   pgm.sql(`ALTER TABLE "marks" ADD CONSTRAINT "user_id_content_unique" UNIQUE(content,user_id)`);
};

exports.down = (pgm) => {
   pgm.dropTable("marks");
   pgm.sql(`ALTER TABLE "marks" DROP CONSTRAINT "user_id_content_unique"'`);
};
