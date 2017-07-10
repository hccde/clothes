let config = require('./configure.js');
let _ = require('lodash');
let globalConfig = require('../configure.js');
let logFile = globalConfig.logFile;
let utils = require('../lib/utils');
let requestFlag = true


let request = require('../lib/request');
let Event = require('../lib/event');
let iconv = require('iconv-lite');
let startime = new Date();

module.exports = {
	run(){
		this.req();
		Event.addEventListener('veroReq',()=>{
			while(config.all.currentPage<config.all.totalPage && requestFlag && 
				request.website['vero'].length<config.concurrency){
				this.req();
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
				let goodsData =  config.all.handler(str);
				//raw data
				if(goodsData == -1){
					requestFlag = false;
				}else{
					this.completeData(goodsData);
				}

			}
			request.remove(req);
			Event.trigger('veroReq');
		})
	},
	getOptions(){
		let options = {
			_name:'vero',
			method:'GET',
			uri:config.all.url,
			qs:config.all.params,
			encoding:null
		};
		options = _.merge(options,globalConfig.headers);
		return options;
	},
	completeData(goodsData){
		//todo
		return goodsData;
	}
}