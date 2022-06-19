/* eslint-disable camelcase */


exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('products', {
    id: {
      type:'id',
      autoIncrement:true,
    },
    category:{
      type:'varchar(100)',
      notNull: true
    },
    features: {
      type:'varchar(1000)',
      notNull: true
    },
    name:{
      type:'varchar(255)',
      notNull: true,
      unique: true
    },
    translate:{
      type:'varchar(255)',
      notNull:true,
      unique: true
    },
    currency:{
      type:'varchar(10)',
      default: '₽'
    },
    price: {
      type: 'double precision',
      notNull: true
    },
    description:{
      type:'varchar(1000)',
      notNull: false,
      default: null
    },
    has_image:{
      type:'boolean',
      notNull: true,
      default: false
    }
  })

};

exports.down = pgm => {
  pgm.dropTable('products')
};
