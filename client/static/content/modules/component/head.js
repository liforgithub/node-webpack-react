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
                            <p className="tx-a" title="">
                                <img className="tx-img" width="35" height="35" src="//pic.qianmi.com/ejz/ejz2.0/img/mdygimg.png"/>
                                <span className="tx-name">{CommonInfo.getUserInfo().nickName}</span>
                            </p>
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
}

export default Head;
