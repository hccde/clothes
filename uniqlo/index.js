let config = require('./configure.js');
let globalConfig = require('../configure.js');
let _ = require('lodash');
let logFile = globalConfig.logFile;
let request = require('request');
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
		request(options,(error,res,body)=>{
			if(error){
				logFile.error(error);
			}else{
				let str = iconv.decode(body,'gbk');
				console.log(str);
				//handle
			}
		})
	},
	getOptions(){
		let options = {
			method:'GET',
			uri:config.all.url,
			qs:runTimeData.params,
			encoding:null
		};
		options = _.merge(options,globalConfig.headers);
		return options;
	}
}