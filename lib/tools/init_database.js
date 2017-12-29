let db =  require('./database');

// created && clear table

// db.Main.sync({force: true}).then(()=>{
// 	return db.Main.create({id:1});
// });
// db.Ip.sync({force: true}).then(()=>{
// 	return db.Ip.create({id:1});
// });

db.Pricechange.sync({force:true}).then(()=>{
	return db.Pricechange.create({id:1});
});