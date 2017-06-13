import React,{Component} from 'react';

/**
 * 分页组件
 */
class Left extends Component {
    componentWillMount(){
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        var that = this;
        var pageNum = that.props.pageNum;
        var totalCount = that.props.totalCount;
        var pageSize = that.props.pageSize;

        var totalPageNum = 0;
        if(totalCount%pageSize>0){
            totalPageNum = parseInt(totalCount/pageSize)+1;
        }else {
            totalPageNum = parseInt(totalCount/pageSize);
        }

        var afterNum = [],beforeNum = [];

        var startPageNum = pageNum;
        while (startPageNum+1 <= totalPageNum && afterNum.length < 2){
            afterNum.push(startPageNum+1);
            startPageNum = startPageNum+1;
        }

        var startPageNum = pageNum;
        while (startPageNum-1 >= 1 && beforeNum.length < 2){
            beforeNum.push(startPageNum-1);
            startPageNum = startPageNum-1;
        }

        var allNumList = [];
        for(var i = beforeNum.length-1; i >= 0; i--){
            allNumList.push(beforeNum[i]);
        }
        allNumList.push(pageNum);
        for(var i =0; i <= afterNum.length-1; i++){
            allNumList.push(afterNum[i]);
        }


        if(pageNum-allNumList[0]<2 && allNumList.length < 5){
            while (allNumList[0]-1 >=1 && allNumList.length < 5){
                allNumList.unshift(allNumList[0]-1);
            }
        }
        if(allNumList[allNumList.length-1]-pageNum<2 && allNumList.length < 5){
            while (allNumList[allNumList.length-1]+1 <= totalPageNum && allNumList.length < 5){
                allNumList.push(allNumList[allNumList.length-1]+1);
            }
        }


        return (
            <div className="pages">
                <ul className="pagination">
                    {
                        pageNum > 1 ?
                            <li onClick={that._callBack.bind(that,pageNum-1)}>
                                <a href="javascript:void(0)" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>:""
                    }
                    {that._renderNumList(allNumList,pageNum)}
                    {
                        pageNum < totalPageNum ?
                            <li onClick={that._callBack.bind(that,pageNum+1)}>
                                <a href="javascript:void(0)" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>:""
                    }
                </ul>
            </div>
        )
    }

    _renderNumList(allNumList,pageNum){
        var that = this;
        return (
            allNumList.map(function(e,index){
                return(
                    <li className={pageNum == e ? "active":""} key={index} onClick={that._callBack.bind(that,e)}>
                        <a href="javascript:void(0)">{e}</a>
                    </li>
                );
            })
        );
    }

    _callBack(newPageNum){
        var that = this;
        that.props.callBack(newPageNum);
    }
}

export default Left;
