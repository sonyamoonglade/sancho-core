/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable("users", {
    id: {
      type:"id",
      autoIncrement: true,
    },

    phone_number: {
      type: "varchar(255)",
      notNull: false,
      default: null,
      unique: true
    },
    role:{
      type: "varchar(100)",
      notNull: true,
    },
    remembered_delivery_address:{
      type: "varchar(1000)",
      notNull: false,
      default: null
    },

    login:{
      type: "varchar(255)",
      notNull: false,
      default: null,
      unique: true
    },
    password: {
      type: "varchar(1000)",
      notNull: false,
      default: null
    }
  })
};

exports.down = pgm => {


  pgm.dropTable('users', {
    cascade: true
  })

};
