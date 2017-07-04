let globalConfig = require('../configure.js');
let logFile = globalConfig.logFile;

module.exports = {
	vaild(level,msg,vaildfn){
		if(vaildfn() !== true){
			this.trigge(level,msg);
			return false;
		}
		return true;
	},
	trigge(level,msg){
		switch(level){
			case 'fatal':
			logFile.error(`fatal:${msg}`);
			case 'warning':
			logFile.warning(`fatal:${msg}`);
			break;
			default:
			logFile.error('unkonwn error');
		}
	}

}