import React,{Component} from 'react';
import CommonInfo from '../../util/CommonInfo'

/**
 * 菜单头部
 */
class Head extends Component {
    componentWillMount(){
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        const that = this;
        return (
            <div className="head">
                <p className="logo" target="_blank">
                    <img width="55" height="42" src="//pic.qianmi.com/ejz/ejz_yun/images/logo.png"/>
                </p>
                <div id="headRight" className="head-right">
                    <ul>
                        <li>
                            <a className="tx-a" title="">
                                <img className="tx-img" width="35" height="35" src="//pic.qianmi.com/ejz/ejz2.0/img/mdygimg.png"/>
                                <span className="tx-name">{CommonInfo.getUserInfo().nickName}</span>
                                <i className="iconfont icon-down"></i>
                            </a>
                            <div className="head-right-nav dis-n">
                                <ol>
                                    <li><a href="javascript:void(0);" title="退出登录" onClick={that._loginOut.bind(that)} style={{'fontSize': '10px'}}><i className="iconfont icon-Sign_out"></i>退出登录</a></li>
                                </ol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    _callBack(){
        let that = this;
        that.props.callBack();
    }

    _loginOut() {
        let hostName = window.location.hostname;
        $.cookie(hostName + 'userInfo', null, {path:"/"});
        window.open('/', "_self");
    }
}

export default Head;
