/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('sessions',{
    session_id: {
      type:'varchar(500)',
      unique: true
    },
    user_id: {
      type: 'int',
      references: '"users"',
      notNull: true,
      onDelete: 'Cascade'
    }
  })
  pgm.createIndex('sessions','user_id')
};

exports.down = pgm => {
  pgm.dropConstraint('sessions','sessions_user_id_fkey')
  pgm.dropTable('sessions')

};

