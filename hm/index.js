let request = require('../lib/request');
let config = require('./configure');
let globalConfig = require('../configure');
let utils = require('../lib/utils');
let _ = require('lodash');
let iconv = require('iconv-lite');
let logFile = globalConfig.logFile;

module.exports = {
	run(){
		let options = this.getOptions();
		let req = request.request(options,(error,res,body)=>{
			if(error){
				logFile.error(error);
			}else{
				let str = iconv.decode(body,'utf-8');
				console.log(str);
				let goodsData = config.handle(str);
				console.log(goodsData);
				//raw data
				// let goodsData = config.all.handle(str);
				// if(goodsData == -1){
					// requestFlag = false;
				// }else{
					// this.completeData(goodsData);
				// }
				// console.log(new Date()-startime)
			}
			// request.remove(req);
			// Event.trigger('uniqloReq');
		})
	},
	getOptions(){
		let options = {
			_name:'hm',
			method:'GET',
			uri:config.all.url,
			qs:config.all.params,
			encoding:null
		};
		options = _.merge(options,globalConfig.headers);
		return options;
	}
}