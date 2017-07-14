let globalConfig = require('../configure.js');
let logFile = globalConfig.logFile;
let mysql = require('mysql');
let _ = require('lodash');
let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'cloth'
});

connection.connect();
let counter = 0;
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
				oldprice = price,
				vaild = 1
			on duplicate key update
				time = price - ${obj.price},
				oldprice = price,
				sex = ${obj.sex},
				href = ${obj.href},
				img = ${obj.img},
				price = ${obj.price},
				sale = ${obj.sale},
				name = ${obj.name},
				desctext = ${obj.desc}
			`,(err,results,field)=>{
			if(err){
				logFile.error('record error: '+ err.toString()+JSON.stringify(obj));
			}
			console.log('insert one record,' + table+ ': counter = ' + counter++);
		})
	},
	closeStorage(){
		connection.end();
	},
	_semaphore:(()=>{
		let i = 0;
		return (name)=>{
			i = i+1;
			console.log(name + 'over')
			if(i>globalConfig.website.length-1){
				//spider over
				//todo get changed goods
				console.log('over');
				let a = 2/0
			}
		}
	})(),
	semaphore:(name)=>{
		let flag = true;
		return ()=>{
			if(flag){
				module.exports._semaphore(name);
				flag = false;
			}
		}
	}
}