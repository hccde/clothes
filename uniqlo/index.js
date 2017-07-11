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
		Event.addEventListener('uniqloReq',()=>{
			while(config.all.currentPage<config.all.totalPage && requestFlag && 
				request.website['uniqlo'].length<config.concurrency){
				this.req();
				config.all.currentPage++;
			}
		});
		this.req();
	},
	req(){
		let options = this.getOptions();
		let req = request.request(options,(error,res,body)=>{
			if(error){
				logFile.error(error);
			}else{
				let str = iconv.decode(body,'gbk');
				//raw data
				let goodsData = config.all.handle(str);
				if(goodsData == -1){
					requestFlag = false;
				}else{
					this.completeData(goodsData);
				}
			}
			request.remove(req);
			return Event.trigger('uniqloReq');
		})
	},
	getOptions(){
		let options = {
			_name:'uniqlo',
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
			try{
			let obj = {}
			let desc = e.desc;
			obj.name = desc;
			obj.sex = desc.indexOf('女')>=0?0:1;
			e.desc = e.desc;
			obj.id = e.href.split('?').pop().split('&').shift().split('=').pop();
			utils.storage(_.merge(obj,e),'uniqlo');
			}catch(e){
				logFile.warn('data error , insert into database crash '+e.toString());
			}
		})
	}
}