import React from 'React';
import ReactDOM from 'react-dom';
import { PullToRefresh } from 'antd-mobile';
import 'antd-mobile/lib/pull-to-refresh/style/index.css';
import '../../css/components/_list.scss';
class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            down: false,
            height: document.documentElement.clientHeight,
            data: [],
        };
    }
    render() {
        return (
            <div style={{width:'100%'}} className="list">
                {/* <PullToRefresh
                    ref={el => this.ptr = el}
                    distanceToRefresh = {window.devicePixelRatio * 5}
                    style={{
                        height: this.state.height,
                        overflow: 'auto',
                    }}
                    indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
                    direction={this.state.down ? 'down' : 'up'}
                    refreshing={this.state.refreshing}
                    onRefresh={() => {
                        this.setState({ refreshing: true });
                        this.props.getList(()=>{
                            this.setState({ refreshing: false });
                        });
                    }}
                > */}
                <div>
                    {this.props.listData.map(el => (
                        <div key={el.id}
                            className="list-item"> 
                            <img src="http://s.hancongcong.com/img.jpeg" ref={
                                (e)=>{
                                    if(!e){
                                        return false;
                                    }
                                    let img = new Image();
                                    let src = el.img.indexOf('http') === -1?'http://'+el.img:el.img;
                                    img.src = src;
                                    img.onload = ()=>{
                                        e.src = src;
                                        e.style.opacity = 1;
                                        img = null;
                                    }
                                }
                            } style = {{opacity:0.08}} />
                            <a href={el.href}><span>{el.name}</span></a>
                            <span> ¥{el.price} </span>
                            {el.pricechange===0?'':(<span>价格
                            {el.pricechange>0?'增加':'减少'}
                            <strong style={{
                                color:el.pricechange>0?'red':'green'
                            }}> ¥{Math.abs(el.pricechange)} </strong>
                            </span>)}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
    componentDidMount() {
        // const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        // // this.setState({
        //     height: hei
        // });
    }
}
export default List;