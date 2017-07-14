let config = require('./configure');
let globalConfig = require('../configure');
let request = require('../lib/request');
let logFile = globalConfig.logFile;
let utils = require('../lib/utils');
let _ = require('lodash');
let iconv = require('iconv-lite');
let Event = require('../lib/Event');
let requestFlag = true;
let semaphore = utils.semaphore('zara');

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
				Event.trigger('zara');
			}
		})
		Event.addEventListener('zara',()=>{
			urlCol = config.all.urlCol[this.hash[this.type]];
			while(this.type<=2&&config.concurrenency>request.website['zara'].length &&
				requestFlag && count<urlCol.length){
				this.url = urlCol[count];
				count+=1;
				this.req();
			}
			if(this.type<=2&&count>=urlCol.length){
				this.type = this.type+1;
				count = 0;
			}
			if(this.type>2){
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
				let goodsData = config.handler(str,this.type);
				//raw data
				if(goodsData == -1){
					requestFlag = false;
				}else{
					this.completeData(goodsData);
				}
			}
			request.remove(req);
			Event.trigger('zara');
		})
	},
	getOptions(){
		let options = {
			_name:'zara',
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
	},
	completeData(goodsData){
		goodsData.forEach((e)=>{
			e.sex = e.type;
			e.time = 0;
			utils.storage(e,'zara');
		})
		//zara's image is wrong 
	}
}