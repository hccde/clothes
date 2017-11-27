import React from 'react';
import { Tabs } from 'antd-mobile';
import 'antd-mobile/lib/tabs/style/index.css'
const tabs = [
    { title:'价格变动' },
    { title:'随便看看' },
  ];
class Content extends React.Component {
    render(){
        return(
            <div>
                <section>
                    <Tabs tabs={tabs}
                        initialPage={0}
                        onChange={(tab, index) => { console.log('onChange', index, tab); }}
                        onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>

                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
                            
                        </div>
                    </Tabs>
                </section>
            </div>
        )
    }
}
export default Content;