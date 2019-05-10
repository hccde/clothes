let Option = require('../lib/interface/option');
let Shop = require('../lib/interface/shop');

let request = require('request');
let Consumer = require('../lib/pattern/consumer');
const Databse = require('../lib/tools/database');
const logFile = require('../lib/tools/log');

let _ = require('lodash');
const RETRY = 3;

let iconv = require('iconv-lite');
let cheerio = require('cheerio');

const type_all = ['衣','鞋','帽','镜','恤','衫','棉','裤','袜','靴','套','包','格','纹','裙'];

let option = new Option({
	method:'GET',
	uri:'https://api.empathybroker.com/search/v1/query/zara/search',
	qs:{
        'o':'json',
        'm':24,
        'q':'衣',
        'scope':'default',
        't':'*',
        'lang':'zh_CN',
        'store':11716,
        'catalogue':25052,
        'warehouse':14551,
        'start':0,
        'rows':24,
        'session':'b82ea90f-6d62-497c-bd7d-37dd9fb966b9',
        'user':'f0b79cd7-2dc6-4901-bb18-84aa4518a9a1'
    },
	total:Number.MAX_VALUE,
	_retry:0,
	_type:0,
	timeout:12000, //timeout
 });
let time = new Date();
let sigleton = null;

class Zara extends Shop {
	constructor(){
		super();
		if(!sigleton){
			sigleton = this;
		}else{
			return sigleton;
		}
	};

	async run(opt = _.cloneDeep(option)){
		await new Consumer().push(()=>{
			return new Promise((resolve,reject)=>{
				let req = request(opt,function(err,res){	
					if(err){
						//failed,retry 3 times
						reject(err);
						sigleton.isRetry(opt,err);
					}else{
						req = null;
						let r = sigleton.handler( iconv.decode(res.body,'utf-8') );
						r.forEach((e)=>{
							sigleton.saveData(e);
						})
						resolve(true);
					}
				})
			}).catch((e)=>{
				//request error for example: timeout
				sigleton.isRetry(opt,e);
			})
		});
		if(opt._retry > 0){ 
			return true;
		}
		option.qs['start'] += option.qs['rows'];// request ok 
		if(option.qs['start'] <= option.total){
			//call itself,avoid callmaxium
			setTimeout(sigleton.run,0);
		}else{
			if(option._type >= type_all.length-1){
				sigleton.resetOption(option);
				sigleton.finish();
			}else{
				sigleton.resetOption(option);
				console.log(type_all[option._type]);
				setTimeout(sigleton.run,0);
			}
		}
	};

	isRetry(opt,e){
		if(opt._retry < RETRY){
			opt._retry+=1;
			sigleton.run(opt);
		}else{
			option.qs['start'] += option.qs['rows']; //jump
			logFile.warn('warn: one request failed' + e.toString() + JSON.stringify(opt));
		}
	}

	resetOption(opt){
		opt._type = opt._type >= type_all.length-1?0:opt._type+1 // reset _type
		opt.total = Number.MAX_VALUE;
		opt.qs.q = type_all[opt._type];
		opt.qs.start = 0;
	}

	handler(str){
        let data = JSON.parse(str);
        option.total = data.numFound;
        let res = [];
        https://static.zara-static.cn/photos///2017/I/0/1/p/8045/422/401/2/w/400/8045422401_2_3_1.jpg?ts=1503413012569
		try{
            data.products.forEach((good)=>{
                res.push({
                    href:'https://www.zara.cn/cn/zh/'+good.seo.keyword+'-p'+good.seo.seoProductId+'.html',
                    name: good.detail.name,
                    img:'https://static.zara-static.cn/photos/'+
                    good.xmedia[0].path+'/w/400/'+good.xmedia[0].name+'.jpg?ts='+good.xmedia[0].timestamp,
                    price: good.price?good.price/100:-1,
                    sale: -1,
                    desc:'',
                    id: 'zara' + new Buffer(good.detail.name, 'utf-8').toString('hex')+ good.id,
                    history: '',
                    yestdayprice: 0,
                    pricechange: 0,
                    updateAt: new Date().getTime()
				});
				// console.log(good.detail.name)
			})
		}catch(e){
			logFile.error('fatal:page changed,selectors have failed: '+e.toString());
		}
		return res;
	};
}

module.exports = Zara

