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
let log= log4js.getLogger('log');

let logFile = {
	warnText:'',
	warnNum:0,
	errorText:'',
	errorNum:0,
	warn(str){
		log.warn(str);
		logFile.warnNum+= 1;
		logFile.warnText = logFile.warnText + str;
	},
	error(str){
		log.error(str);
		logFile.errorNum+=1;
		logFile.errorText = logFile.errorText + str;
	}
}
module.exports = logFile