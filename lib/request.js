let _request = require('request');
let utils = require('./utils');
let globalConfig = require('../configure');
let _ = require('lodash');

let website = {};
globalConfig.website.forEach((web)=>{
	website[web] = []
})
module.exports ={
	website:website,
	request(options,callback){
		let req;
		utils.vaild('error','request options must has _name attributes,tell which website',()=>{
			return globalConfig.website.indexOf(options._name) !== -1
		}) && (()=>{
			let r = _request(options,callback);
			req = {
				req:r,
				id:globalConfig.requestId,
				website:options._name
			}
			this.website[options._name].push(req);
		})();
		return req;
	},
	kill(web){
		this.website[web].map((obj)=>{
			obj.req.abort();
		});
		this.website[web] = new Array();
	},
	remove(req){
		let index = _.findIndex(this.website[req.website],(e)=>{
			return e.id == req.id
		})
		this.website[req.website].splice(index,1);
	},
	stop(){
		
	}
}