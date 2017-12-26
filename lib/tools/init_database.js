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

// created && clear table
Main.sync({force: true}).then(()=>{
	return Main.create({id:1});
});
Ip.sync({force: true}).then(()=>{
	return Ip.create({id:1});
});
