import React from 'react';
import Content from './components/content.jsx';
class Main extends React.Component {
	constructor(props) {
        super(props);
    }
	render(){
		return(
			<div className='container'>
				<Input onInputClick={(key)=>{
					this.search(key)
				}}  hasBack = {false} />
				<Content ref="content" />
			</div>
		);
	}
	search(key){
		this.refs.content.getMoreSearch(key);
	}
}
function Input(props){
	let value = '';
	return <header> 
			{props.hasBack?(<span>后退</span>):''}
			<input className="search" type="textarea" onChange={(e)=>{
				value = e.target.value;
			}} />
			<span onClick={()=>{
					console.log(value);
					props.onInputClick(value)
			}}>
				搜索
			</span>
		</header>
}
export default Main;