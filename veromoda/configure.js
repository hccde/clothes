let cheerio = require('cheerio');
let utils = require('../lib/utils');
let request = require('../lib/request');
let globalConfig = require('../configure');

let logFile = globalConfig.logFile;
let warningLimit = 20,warningCount=0,currentPage=1;

module.exports = {
	all:{
		url:'http://www.veromoda.com.cn/cn/vmstore/sysp.html',
		params:{
			manufacturer:'',
			searchType:'',
			resultCatEntryType:'',
			searchTerm:'',
			catalogId:10001,
			categoryId:-30,
			langId:-7,
			storeId:10151,
			sType:'SimpleSearch',
			filterFacet:'',
			metaData:'',
			facet:'',
			facet:'',
			facet:'',
			subCategoryId:'',
			occasionFacet:'',
			colorFacet:'',
			sizeFacet:'',
			sizeflag:'',
			colorflag:'',
			occasionflag:'',
			pageSize:0,
			beginIndex:40,
			orderBy:5,
			categoryId:''
		},
		handler(str){

		}
	}
}