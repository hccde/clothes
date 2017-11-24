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

module.exports = logFile;