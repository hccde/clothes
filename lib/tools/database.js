let Sequelize  = require('sequelize');
let password = require('../../password.js');
const sequelize = new Sequelize('clothes', password.database.user, password.database.password, {
  host: 'localhost',
  dialect: 'mysql',
	operatorsAliases: false,
	pool:{
		max: 50,
		min: 0,
		idle: 200000,
 },
  define:{
  	charset: 'utf8',
  	collate: 'utf8_general_ci',	
  },
  logging:false
});

//test connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Main = sequelize.define('Main',{
	id: {
		type:Sequelize.STRING,
		primaryKey: true
	},
	href:{
		type:Sequelize.TEXT
	},
	name:{
		type:Sequelize.TEXT
	},
	img:{
		type:Sequelize.TEXT
	},
	price:{
		type:Sequelize.FLOAT(11)
	},
	sale:{
		type:Sequelize.INTEGER
	}, 
	desc:{
		type:Sequelize.TEXT
	},
	history:{
		type:Sequelize.TEXT
	},
	yestdayprice:{
		type:Sequelize.FLOAT(11)
	},
	pricechange:{
		type:Sequelize.FLOAT(11)
	},
	updateAt:{
		type:Sequelize.BIGINT
	}
});

const Ip = sequelize.define('Ip',{
	id: {
		type:Sequelize.STRING,
		primaryKey: true
	},
	count:{
		type:Sequelize.BIGINT
	},
	updateAt:{
		type:Sequelize.BIGINT
	}
});

const Pricechange = sequelize.define('Pricechange',{//nature week
	id: {
		type:Sequelize.STRING,
		primaryKey: true
	},
	href:{
		type:Sequelize.TEXT
	},
	name:{
		type:Sequelize.TEXT
	},
	img:{
		type:Sequelize.TEXT
	},
	sale:{
		type:Sequelize.INTEGER
	}, 
	price:{
		type:Sequelize.FLOAT(11)
	},
	desc:{
		type:Sequelize.TEXT
	},
  	history:{
		type:Sequelize.TEXT
	},
	updateAt:{
		type:Sequelize.BIGINT
	},
	isvaild:{
		type:Sequelize.INTEGER
	},
	pricechange:{
		type:Sequelize.FLOAT(11)
	}
})

module.exports =  {
	sequelize,
	Main,
	Ip,
	Pricechange
}