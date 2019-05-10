import React from 'react';
import Content from './components/content.jsx';
class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state ={
			hasBack:false
		}
    }
	render(){
		return(
			<div className='container'>
				<Input onInputClick={(key)=>{
					this.search(key);
					this.setState({
						hasBack:true
					});
				}}  hasBack = {this.state.hasBack} onBack = {this.back.bind(this)} />
				<Content ref="content" />
			</div>
		);
	}
	search(key){
		this.refs.content.getSearch(key);
	}
	back(){
		this.refs.content.backMain();
		this.setState({
			hasBack:false
		})
	}
}
function Input(props){
	let value = '';
	return <header className="search-bar"> 
			<a className="back-wrap">
			{props.hasBack?(<span className="icon-返回箭头 back" onClick={()=>{
				props.onBack();
			}}></span>):''}
			</a>
			<input className="search" type="textarea" onChange={(e)=>{
				value = e.target.value;
			}} />
			<span onClick={()=>{
				props.onInputClick(value)
			}} className="icon-搜索 search-icon">
			</span>
		</header>
}
export default Main;