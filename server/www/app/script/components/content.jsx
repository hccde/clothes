import React from 'react';
import { Tabs } from 'antd-mobile';
import List from './list.jsx';
import axios from 'axios';
import 'antd-mobile/lib/tabs/style/index.css'
const tabs = [
    { title: '价格变动' },
    { title: '随便看看' },
];
class Content extends React.Component {
    constructor(props) {
        super(props);
        this.currentPricePage = 1;
        this.state = {
            priceList: [],
            randomList:[]
        };
        this.getPriceList();
    };
    render() {
        return (
            <div style={{ height: '100%' }}>
                <section style={{ height: '100%' }}>
                    <Tabs tabs={tabs}
                        initialPage={0}
                        onChange={(tab, index) => {}}
                        onTabClick={(tab, index) => {
                            console.log(index)
                            if(index == 1){
                                this.getRandomData();
                            }
                        }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                            {this.state.priceList.length > 0 ?
                                (<List listData={this.state.priceList} getList={this.getMorePriceData.bind(this)}>
                                </List>) : ''}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                            {this.state.randomList.length > 0 ?
                                (<List listData={this.state.randomList} getList={this.getRandomData.bind(this)}>
                                </List>) : ''}
                        </div>
                    </Tabs>
                </section>
            </div>
        )
    };

    componentDidMount() {
        this.setState({
            priceList: this.state.priceList
        });
    }
    async getMorePriceData(fn = function () { }) {
        await this.getPriceList({
            currentPage: (this.currentPricePage += 1),
            pageSize: 20
        });
        fn();
    }

    async getRandomData(fn=function(){}){
        let res = await axios.get('/random');
        this.setState({
            randomList: this.state.randomList.concat(res.data)
        });
        fn();
    }

    async getPriceList(option = {
        currentPage: this.currentPricePage,
        pageSize: 20
    }
    ) {
        let res = await axios.get('/list', {
            params: option
        });
        //todo `code msg data`
        //update view
        this.setState({
            priceList: this.state.priceList.concat(res.data)
        });
    }


}
export default Content;