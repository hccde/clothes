import React from 'react';
import Content from './components/content.jsx';
import DateBoard from './components/dateboard.jsx';

class Main extends React.Component {
	render(){
		return(
			<div className='container'>
				<DateBoard/>
				<Content/>
			</div>
);
	}
}
export default Main;