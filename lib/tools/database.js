let Sequelize  = require('sequelize');
const sequelize = new Sequelize('clothes', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
	operatorsAliases: false,
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

// created && clear table
// Main.sync({force: true}).then(()=>{
// 	return Main.create({id:1});
// });

module.exports =  {
	sequelize,
	Main
}