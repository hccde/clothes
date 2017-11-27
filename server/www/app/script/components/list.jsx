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
                <PullToRefresh
                    ref={el => this.ptr = el}
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
                >
                <div>
                    {this.props.listData.map(el => (
                        <div key={el.id} style={{width: '100%' }}
                            className="list-item">
                            <img onClick={this.goTo(el)} src={
                                el.img.indexOf('http://') === -1?'http://'+el.img:el.img
                            }/>
                            <span>{el.name}</span>
                            <span>{el.price}¥</span>
                            {el.pricechange===0?'':(<span>价格
                            {el.pricechange>0?'增加':'减少'}
                            <strong style={{
                                color:el.pricechange>0?'red':'green'
                            }}> {Math.abs(el.pricechange)}¥ </strong>
                            </span>)}
                        </div>
                    ))}
                </div>
                </PullToRefresh>
            </div>
        )
    }
    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        setTimeout(() => this.setState({
            height: hei
        }), 0);
    }
    goTo(el){
        window.location.href = el.href;
    }
}
export default List;