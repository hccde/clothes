let config = require('./configure');
let globalConfig = require('../configure');
let request = require('../lib/request');
let logFile = globalConfig.logFile;
let utils = require('../lib/utils');
let _ = require('lodash');
let iconv = require('iconv-lite');
let Event = require('../lib/Event');
let requestFlag = true;
module.exports = {
	run(){
		let options = this.getOptions();
		let urlCol = [];
		let count = 0;
		let req = request.request(options,(error,res,body)=>{
			if(error){
				logFile.error(error);
			}else{
				let str = iconv.decode(body,'utf-8');
				config.all.handler(str);
				urlCol = config.all.urlCol[this.hash[this.type]];
				Event.trigger('zara')
			}
		})
		Event.addEventListener('zara',()=>{
			this.url = urlCol[count];
			this.req();
			return;
			while(config.concurrenency>request.website['hm'].length &&
				requestFlag && count<urlCol.length){
				this.url = urlCol[count];
				this.req();
				count+=1;
			}
			if(count>=urlCol.length-1){
				this.type =+ 1;
				count = 0;
			}
		})
	},
	req(){
		let options = this.getOptions();
		let req = request.request(options,(error,res,body)=>{
			if(error){
				logFile.error(error);
			}else{
				let str = iconv.decode(body,'utf-8');
				let goodsData = config.handler(str,this.type);
				console.log(goodsData)
				//raw data
				// if(goodsData == -1){
					// requestFlag = false;
				// }else{
					// this.completeData(goodsData);
				// }
			}
			// request.remove(req);
			// Event.trigger('zara');
		})
	},
	getOptions(){
		let options = {
			_name:'hm',
			method:'GET',
			uri:this.url,
			qs:config.all.params,
			encoding:null
		};
		options = _.merge(options,globalConfig.headers);
		return options;
	},
	url:config.all.url,
	type:0,
	hash:{
		0:'woman',
		1:'man',
		2:'kid'
	}
}