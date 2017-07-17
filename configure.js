let log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    { 	type: 'file', 
    	filename: 'log.txt',
    	naxLongSize:20480,
    	backups:20
	}
  ]
});
let logFile = log4js.getLogger('log');

let _requestId = -1;

 module.exports = {
 	headers:{
 		'User-Agent':`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 
 		(KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36`,
 		'Accept':`text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8`,
 		'Accept-Encoding':`deflate`,
 		'Accept-Language': `zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4`,
 		'Cache-Control':`no-cache`,
 		'Connection':`keep-alive`,
 	},
 	logFile:logFile,
 	website:['uniqlo','zara','hm','vero','only'],
 	get requestId(){
 		return _requestId+1;
 	}
 }