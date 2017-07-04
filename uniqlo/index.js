let config = require('./configure.js');
let _ = require('lodash');
let globalConfig = require('../configure.js');
let logFile = globalConfig.logFile;

let request = require('../lib/request');
let iconv = require('iconv-lite');
let runTimeData = {
	params:_.clone(config.all.params)
}

module.exports = {
	run(){
		//init runTimeData
		runTimeData.params.pageNum = 1;
		// request
		this.getReq()
	},
	getReq(){
		let options = this.getOptions();
		request.request(options,(error,res,body)=>{
			if(error){
				logFile.error(error);
			}else{
				let str = iconv.decode(body,'gbk');
				config.all.handle(str);
			}
		})
	},
	getOptions(){
		let options = {
			_name:'uniqlo',
			method:'GET',
			uri:config.all.url,
			qs:runTimeData.params,
			encoding:null
		};
		options = _.merge(options,globalConfig.headers);
		return options;
	}
}