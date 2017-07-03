
module.exports = {
	all:{
		url:`http://www.uniqlo.cn/search.htm?search=y&viewType=grid&orderType=_newOn`,
		method:'get',
		params:{
			pageNum:2
		},
		handle(){

		}
	},
	concurrency:20
}