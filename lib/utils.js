let globalConfig = require('../configure.js');
let logFile = globalConfig.logFile;
let mysql = require('mysql');

let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'cloth'
});

connection.connect();

module.exports = {
	vaild(level,msg,vaildfn){
		if(vaildfn() !== true){
			this.trigge(level,msg);
			return false;
		}
		return true;
	},
	trigge(level,msg){
		switch(level){
			case 'fatal':
			logFile.error(`fatal:${msg}`);
			case 'warning':
			logFile.warning(`fatal:${msg}`);
			break;
			default:
			logFile.error('unkonwn error');
		}
	},
	storage(obj,table){
		//filter
		Object.keys(obj).forEach((e)=>{
			obj[e] = mysql.escape(obj[e]);
		});


		connection.query(`
			insert into
				${table}
			set
				id = ${obj.id},
				sex = ${obj.sex},
				href = ${obj.href},
				img = ${obj.img},
				price = ${obj.price},
				sale = ${obj.sale},
				name = ${obj.name},
				desctext = ${obj.desc},
				vaild = 1
			on duplicate key update
				sex = ${obj.sex},
				href = ${obj.href},
				img = ${obj.img},
				price = ${obj.price},
				sale = ${obj.sale},
				name = ${obj.name},
				desctext = ${obj.desc}
			`,(err,results,field)=>{
			if(err){
				logFile.error('record error: '+ err.toString());
			}
			console.log('insert one record');
		})
	}

}