let _request = require('request');
let utils = require('./utils');
let globalConfig = require('../configure');
let website = {};
globalConfig.website.forEach((web)=>{
	website[web] = []
})
module.exports ={
	website:website,
	request(options,callback){
		utils.vaild('error','request options must has _name attributes,tell which website',()=>{
			return globalConfig.website.indexOf(options._name) !== -1
		}) && (()=>{
			req = _request(options,callback);
			this.website[options._name].push({
				req:req,
				id:globalConfig.requestId
			});
		})();

	},
	kill(web){
		this.website[web].map((obj)=>{
			obj.req.abort();
		});
		this.website[web] = new Array();
	}
}