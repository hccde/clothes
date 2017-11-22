let _ = require('lodash');
let headers = {
 	'User-Agent':`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36(KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36`,
 	'Accept':`text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8`,
 	'Accept-Language': `zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7`,
 	'Cache-Control':`no-cache`,
	'Connection':`keep-alive`,
	'DNT':1,
	'Pragma':'no-cache'
 }
class Option {
	constructor(option){
		return _.merge({
			'headers':_.cloneDeep(headers),
			'encoding':null,
			'timeout':12000,
		},option);
	}
}

module.exports = Option;