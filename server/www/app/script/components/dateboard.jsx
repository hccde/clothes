import React from 'React';
import '../../css/components/_dateboard.scss';
const time = new Date();
const DateInfo = <div>
    <p className='dateboard'>
        现在是<span> {time.getFullYear()} 年 </span>
        <span>{time.getMonth()+1} 月 </span>
        <span>{time.getDate()} 日 </span>
    </p>
</div>
class DateBoard extends React.Component {
    render(){
        return DateInfo;
    }
}

export default DateBoard;