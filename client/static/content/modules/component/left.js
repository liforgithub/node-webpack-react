import React,{Component} from 'react';

/**
 * 菜单左侧
 */
class Left extends Component {
    componentWillMount(){
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        const that = this;
        let chooseTab = that.props.chooseTab;
        return (
            <div className="slide-left">
                <ul>
                    <li className={chooseTab=="MaintainInfo" ? "active" : ""} onClick={that._chooseTab.bind(that,"#/maintainInfo")}>
                        <a href="javascript:void(0)" title="开发&维护">开发&维护</a>
                    </li>
                    <li className={chooseTab=="MyTaskInfo" ? "active" : ""} onClick={that._chooseTab.bind(that,"#/myTaskInfo")}>
                        <a href="javascript:void(0)" title="我的任务">我的任务</a>
                    </li>
                    <li className={chooseTab=="TplInfo" ? "active" : ""} onClick={that._chooseTab.bind(that,"#/tplInfo")}>
                        <a href="javascript:void(0)" title="模板详情">模板详情</a>
                    </li>
                </ul>
            </div>
        )
    }

    _chooseTab(url){
        window.location.href = url;
    }
}

export default Left;
