// # important!!! single thread consumer #
let _capacity = 10;
//default capacity
const _container = [];

//debug
// global.container = _container

let _position = [];
//the size of array equal the times of calling `push` function in the project
let  wait_queue = [];

let sigleton = null;
let t= 1;
class Consumer {
	constructor(capacity = 3){	
		if(!sigleton){
			sigleton = this;
			_capacity = capacity;
			for(let i = 0;i < _capacity;i++){
				_position.push(i);
			}
		}else{
			return sigleton;
		}
	};

	get capacity(){
		return _capacity;
	};
	set capacity(val){
		throw('readonly')
	};
	async push(promise){
		if(_position.length > 0){
			let index = _position.shift();
			//wrap `promise object` with another promise,return position `index`
			_container[index] = new Promise(function(reslove,reject){
				Promise.all([promise()]).then(()=>{
					reslove(index);
				})
			});
			//make warm
			if(_position.length == _capacity-1){
				_run();
			}
			await true
		}else{
			let wait = new Promise((reslove,reject)=>{
				wait_queue.push((index)=>{
					reslove();
					return new Promise(function(reslove,reject){
						Promise.all([promise()]).then(function(){
							reslove(index);
						})
					});
				});
			});
			await wait;
		}
	};
}

async function _run(){
	await Promise.race(_container).then(function(index){
		_position.push(index)
		while(_position.length > 0 && wait_queue.length > 0){
			let ind = _position.pop();
			_container[ind] = (wait_queue.shift())(ind);
		}
		if(_position.length < _capacity){
			//avoid `stack overflow`
			setTimeout(_run,0);
		}
	});
}

module.exports = Consumer;