// # important!!! single thread consumer #
let _capacity = 10;
//default capacity
const _container = [];
let _position = [];
//the size of array equal the times of calling `push` function in the project
let  wait_queue = [];

let sigleton_flag = true;
let t= 1;
class Consumer {
	constructor(capacity = 10){	
		if(sigleton_flag){
			sigleton_flag = false;
			_capacity = capacity;
			//todo
			for(let i = 0;i < capacity;i++){
				_position.push(i);
			}
		}else{
			throw('sigleton,forbid constructor calling')
		}
	};

	get capacity(){
		return _capacity;
	};
	set capacity(val){
		throw('readonly')
	};
	// 此处的promise 应该是一个返回值为promise的函数 写成抽象接口 todo
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
			if(_position.length == 4){
				_run();
			}
			//don't wait for container
			await true
		}else{
			let wait = new Promise((reslove,reject)=>{
				wait_queue.push((index)=>{
					reslove();
					return new Promise(function(reslove,reject){
						Promise.all([promise()]).then(function(){
							// console.log(index)
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
			_run();
		}
	});
}

module.exports = Consumer;