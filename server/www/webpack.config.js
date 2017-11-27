let path = require('path');
require("babel-polyfill");

module.exports = {
	entry:{
		index:['babel-polyfill','./app/index.jsx'],
	},
	output:{
		path:path.resolve(__dirname,'dist'),
		filename:'[name].js'
	},
	module:{
		rules:[
			{
				test:/\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				use:{
					loader:'babel-loader',
					options:{
						presets: ['env'],
						plugins: [require("babel-plugin-transform-react-jsx")]						
					}
				}
			},
			{
				test:/\.(scss|css)$/,
				use:[
					{
						loader: "style-loader"  
					}, {
						loader: "css-loader" 
					}, {
						loader: "sass-loader"
					}]
			}
		]
	}
}