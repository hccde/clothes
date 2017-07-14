let config = require('./configure.js');
let _ = require('lodash');
let globalConfig = require('../configure.js');
let logFile = globalConfig.logFile;
let utils = require('../lib/utils');
let requestFlag = true


let request = require('../lib/request');
let Event = require('../lib/event');
let iconv = require('iconv-lite');
let semaphore = utils.semaphore('only');

module.exports = {
	run(){
		this.req();
		Event.addEventListener('onlyReq',()=>{
			while(config.all.currentPage<config.all.totalPage && requestFlag && 
				request.website['only'].length<config.concurrency){
				this.req();
			}
			if(config.all.currentPage>=config.all.totalPage){
				semaphore();
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
			Event.trigger('onlyReq');
		})
	},
	getOptions(){
		let options = {
			_name:'only',
			method:'GET',
			uri:config.all.url,
			qs:config.all.params,
			encoding:null
		};
		options = _.merge(options,globalConfig.headers);
		return options;
	},
	completeData(goodsData){
		goodsData.forEach((e)=>{
			e.time = 0;
			utils.storage(e,'only');
		})
		return goodsData;
	}
}