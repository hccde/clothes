let cheerio = require('cheerio');
let utils = require('../lib/utils');

module.exports = {
	all:{
		url:`http://www.uniqlo.cn/search.htm?search=y&viewType=grid&orderType=_newOn`,
		method:'get',
		params:{
			pageNum:1
		},
		totalPage:1,
		handle(str){
			let $ =	cheerio.load(str);
			let pageInfo  = $('.page-info').text().split('/');
			utils.vaild('error','lack totalPage info',()=>{
				if(pageInfo.length<2 || isNaN(Number(pageInfo[1]))){
					
					return false;
				}else{
					console.log(pageInfo[1])
					return true;
				}
			})
		}
	},
	concurrency:20
}