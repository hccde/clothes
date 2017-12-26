let db =  require('./database');

// created && clear table

db.Main.sync({force: true}).then(()=>{
	return Main.create({id:1});
});
db.Ip.sync({force: true}).then(()=>{
	return Ip.create({id:1});
});