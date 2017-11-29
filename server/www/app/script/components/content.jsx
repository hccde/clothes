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
        this._priceList = void 0;
        this._randomList = void 0;
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
    async getMorePriceData(fn = function () {}) {
        await this.getPriceList({
            currentPage: (this.currentPricePage += 1),
            pageSize: 20
        });
        fn();
    }

    async getRandomData(fn=function(){}){
        if(this._randomList === void 0 
            || this._randomList.length <= 0){
            //get nextturn data
            let res = await axios.get('/random');
            if(this._randomList === void 0
                 && (this._randomList = res.data)
                ){
                    this.getRandomData();
            }
            this._randomList = res.data;
        }else{
            await true;
            this.setState({
                randomList: this.state.randomList.concat(this._randomList)
            },()=>{
                fn();
                this._randomList = [];
                this.getRandomData();
            });
        }
    }

    async getPriceList(option = {
        currentPage: this.currentPricePage,
        pageSize: 20
    }
    ) {

        //todo `code msg data`
        //update view
        if(this._priceList === void 0 
            || this._priceList.length <= 0){
            //get nextturn data
            let res = await axios.get('/list', {
                params: option
            });
            if(this._priceList === void 0
                && (this._priceList = res.data)
            ){
                this.getPriceList({
                    currentPage: (this.currentPricePage+=1),
                    pageSize: 20
                });
            }
            this._priceList = res.data;
        }else{
            this.setState({
                priceList: this.state.priceList.concat(this._priceList)
            },()=>{
                this._priceList = [];
                this.getPriceList({
                    currentPage: (this.currentPricePage+=1),
                    pageSize: 20
                });
            });
        }
        }


}
export default Content;