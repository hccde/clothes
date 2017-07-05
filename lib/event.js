let _ = require('lodash');

let eventBus = {

}
module.exports = {
	addEventListener(eventName,callback){
		eventBus[eventName] = eventBus[eventName]?_.merge(eventBus[eventName],[callback]):[callback];
	},
	trigger(eventName){
		Array.isArray(eventBus[eventName]) && eventBus[eventName].forEach((e)=>{
			e();			
		})
	},
	removeEventListener(eventName){
		delete eventBus['eventName'];
	}
}