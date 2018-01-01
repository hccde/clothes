import React from 'react';
import { Tabs } from 'antd-mobile';
import List from './list.jsx';
import axios from 'axios';
import 'antd-mobile/lib/tabs/style/index.css'
class Content extends React.Component {
    constructor(props) {
        super(props);
        this.currentPricePage = 1;
        this.currentSearchPage = 1;
        this.currentCreatePage = 1;
        this.state = {
            priceList: [],
            createList:[],
            searchList:[],
            _search:false,
            active:1
        };
        this._key = '';
        this._priceList = void 0;
        this._createList = void 0;
        this.getPriceList()
    };
    render() {
        return (
            <div className="list-container">
                {this.state._search?(
                <div>
                <ul className="tabs">
                    <li style={{ width:"100%"}}>搜索结果</li>
                </ul>
                <div className="list-main">
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                            <List listData={this.state.searchList} getList={this.getMoreSearch.bind(this)}>
                            </List>
                        </div>
                    </section>
                </div></div>):
                (<div><section>
                    <ul className="tabs">
                        <li className={this.state.active == 1?'active':''} onClick={
                            ()=>{
                                this.setState({
                                    active:1
                                });
                            }
                        }>价格变化</li>

                        <li className= {this.state.active == 2?'active':''} onClick={
                            ()=>{
                                if(this.state.createList.length <= 0){
                                    this.getcreateData();
                                }
                                this.setState({
                                    active:2
                                });
                        }}>最近添加</li>
                    </ul>
                    <div style={{alignItems: 'center', justifyContent: 'center', 
                    backgroundColor: '#fff',display:this.state.active==1?'flex':'none' }} className="list-main">
                        {this.state.priceList.length > 0 ?
                            (<List listData={this.state.priceList} getList={this.getMorePriceData.bind(this)}>
                            </List>) : ''}
                    </div>
                    <div style={{alignItems: 'center', justifyContent: 'center',
                     backgroundColor: '#fff',display:this.state.active==2?'flex':'none' }} className="list-main">
                        {this.state.createList.length > 0 ?
                            (<List listData={this.state.createList} getList={this.getcreateData.bind(this)}>
                            </List>) : ''}
                    </div>
                </section></div>)
                }
            </div>
        )
    };

    componentDidMount() {
        this.setState({
            priceList: this.state.priceList
        },()=>{
            let els = document.getElementsByClassName('list-main');
            for(let i = 0;i<els.length;i++){
                els[i].addEventListener('scroll',()=>{
                    console.log(1);
                })
            }
        });
    }
    async getMoreSearch(){
        let res = await axios.get('/search',{
            params:{
                key:this._key,
                currentPage:this.currentSearchPage,
                pageSize:20
            }
        });
        this.setState({
            searchList: this.state.searchList.concat(res.data),
            _search:true
        },()=>{
           this.currentSearchPage+=1;
        });
    }

    async getSearch(key){
        this._key = key;
        let res = await axios.get('/search',{
            params:{
                key:key,
                currentPage:this.currentSearchPage,
                pageSize:20
            }
        });
        console.log(res.data)
        this.setState({
            searchList: res.data,
            _search:true
        },()=>{
           this.currentSearchPage = 1;
        });
    }

    backMain(){
        this.setState({
            _search:false
        },()=>{
            this.currentSearchPage = 1;
         })
    }

    async getMorePriceData(fn = function () {}) {
        await this.getPriceList({
            currentPage: (this.currentPricePage += 1),
            pageSize: 20
        });
        fn();
    }
    async getcreateData(fn=function(){}){
        if(this._createList === void 0 
            || this._createList.length <= 0){
            //get nextturn data
            let res = await axios.get('/newItem',{
                params:{
                    currentPage:this.currentCreatePag,
                    pageSize:20
                }
            });
            this.currentCreatePag+=1;
            if(this._createList === void 0
                 && (this._createList = res.data)
                ){
                    this.getcreateData();
            }
            this._createList = res.data;
        }else{
            await true;
            this.setState({
                createList: this.state.createList.concat(this._createList)
            },()=>{
                fn();
                this._createList = [];
                this.getcreateData();
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