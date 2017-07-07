let request = require('../lib/request');
let config = require('./configure');
let globalConfig = require('../configure');
let utils = require('../lib/utils');
let _ = require('lodash');
let iconv = require('iconv-lite');
let Event = require('../lib/event');

let requestFlag = true;
let logFile = globalConfig.logFile;

module.exports = {
	run(){
		let length = config.types.length;

		Event.addEventListener('hm',()=>{
			while(config.all.currentOffset<config.all.total && requestFlag && 
				request.website['hm'].length<config.concurrency){
				this.req();
			}
			if(config.all.currentOffset>=config.all.total){
				if(this.type<length-1){
					console.log(config.types[this.type]+' over');
					//reset
					config.reset();
					this.type+=1;
					config.all.params['product-type'] = config.types[this.type];
					this.req();
				}
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
				let str = iconv.decode(body,'utf-8');
				let goodsData = config.handler(str,this.type);
				console.log(goodsData)
				//raw data
				if(goodsData == -1){
					requestFlag = false;
				}else{
					this.completeData(goodsData);
				}
			}
			request.remove(req);
			Event.trigger('hm');
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
	},
	type:0,
	completeData(){

	}
}