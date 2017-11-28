let path = require('path');
let webpack = require('webpack');
require("babel-polyfill");

module.exports = {
	entry:{
		index:['babel-polyfill','./app/index.jsx'],
		vendor: ['react', 'react-dom']
	},
	output:{
		path:path.resolve(__dirname,'dist'),
		filename:'[name].js',
		chunkFilename: "[name].js",
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
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
		  compress: {
			warnings: false
		  }
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor'],
			minChunks: Infinity
		}),
		new webpack.optimize.AggressiveMergingPlugin()
	  ]
}