import React,{Component} from 'react';

/**
 * 删除二次确认
 */
class Confirm extends Component {
    componentWillMount(){
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        const that = this;

        return (
            <div className="modal fade alertSecondSure" id={that.props.id} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <h4>{that.props.title}</h4>
                            <p className="btn-del">
                                <a className="btn-delY" data-dismiss="modal" onClick={that._callBack.bind(that)}>{that.props.text}</a>
                                <a className="btn-delN" data-dismiss="modal" onClick={that._cancelCallBack.bind(that)}>取消</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    _callBack(){
        var that = this;

        if(that.props.callBack) {
            that.props.callBack();
        }
    }

    _cancelCallBack(){
        var that = this;

        if(that.props.cancelCallBack) {
            that.props.cancelCallBack();
        }
    }
}

export default Confirm;
