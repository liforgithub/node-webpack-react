/**
 * Created by 李雪洋 on 2017/5/19.
 */
import React from "react";
import {msg as Messages, connectToStore} from "iflux";
import {Link, withRouter} from "react-router";
import Head from "../component/head"
import Left from "../component/left"
import CommonInfo from "../../util/CommonInfo";
import Paging from "../component/paging";
import DateUtil from "../../util/date-util";
import Confirm from "../component/confirm";
import appStore from "./store";

class TplInfo extends React.Component {

    componentWillMount(){
        Messages.emit('TplInfo:queryList');
        Messages.emit('TplInfo:queryUserList');
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        let that = this;
        return (
            <div>
                <Head/>
                <div className="contain">
                    <Left chooseTab={appStore.data().get("chooseTab")}/>
                    <div className="right-content">
                        <h3>模板详情</h3>
                        <div className="content">
                            <ul className="tab-li">
                                <li><a href="javascript:void(0)" title="模板资源信息记录">模板资源信息记录</a></li>
                                {
                                    CommonInfo.getUserInfo().authority < 3 ? <a className="pull-right btn btn-sm btn-primary" onClick={that._addTplInfo.bind(that)}>新增模板详情</a> : ""
                                }
                            </ul>
                            <div className="search">
                                <table>
                                    <div className="search-cont">
                                        <td>
                                            <div className="search-left">模板编号：</div>
                                            <div className="search-right">
                                                <label className="input-icon"><input placeholder="模板编号" className="form-input" type="text" value={appStore.data().getIn(['chooseForm','tpl_id'])} onChange={that._change_tpl_Id} /></label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="search-left">模板类型：</div>
                                            <div className="search-right">
                                                <select name="" className="form-input" onChange={that._change_cx_or_cz.bind(that)}>
                                                    <option value="0" selected={appStore.data().getIn(['chooseForm','cx_or_cz']) == 0 ? "selected" : ""}>--------请选择--------</option>
                                                    <option value="1" selected={appStore.data().getIn(['chooseForm','cx_or_cz']) == 1 ? "selected" : ""}>查询</option>
                                                    <option value="2" selected={appStore.data().getIn(['chooseForm','cx_or_cz']) == 2 ? "selected" : ""}>充值</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="search-left">开发人：</div>
                                            <div className="search-right">
                                                <select name="" className="form-input" onChange={that._change_execute_name.bind(that)}>
                                                    <option value="" selected={appStore.data().getIn(['chooseForm','execute_name']) == "0" ? "selected" : ""}>--------请选择--------</option>
                                                    {that._renderChangeExecuteNameList()}
                                                </select>
                                            </div>
                                        </td>
                                    </div>
                                    <div className="search-cont">
                                        <td>
                                            <div className="search-left">模板名称：</div>
                                            <div className="search-right">
                                                <label className="input-icon"><input placeholder="模板名称" className="form-input" type="text" value={appStore.data().getIn(['chooseForm','tpl_name'])} onChange={that._change_tpl_name} /></label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="search-left">模板范围：</div>
                                            <div className="search-right">
                                                <select name="" className="form-input" onChange={that._change_hf_or_sdm.bind(that)}>
                                                    <option value="0" selected={appStore.data().getIn(['chooseForm','hf_or_sdm']) == "0" ? "selected" : ""}>--------请选择--------</option>
                                                    <option value="1" selected={appStore.data().getIn(['chooseForm','hf_or_sdm']) == "1" ? "selected" : ""}>话费</option>
                                                    <option value="2" selected={appStore.data().getIn(['chooseForm','hf_or_sdm']) == "2" ? "selected" : ""}>公共事业</option>
                                                    <option value="3" selected={appStore.data().getIn(['chooseForm','hf_or_sdm']) == "3" ? "selected" : ""}>综合</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="search-left">资源网址：</div>
                                            <div className="search-right">
                                                <label className="input-icon"><input placeholder="创建时间" className="form-input" type="text"/></label>
                                            </div>
                                        </td>
                                    </div>
                                    <div className="search-cont">
                                        <a className="btn btn-sm btn-primary" onClick={that._searchList.bind(that)}>搜索</a>&nbsp;&nbsp;&nbsp;
                                        <a className="btn btn-sm" style={{backgroundColor: "gray", color: "white"}} onClick={that._resetChooseForm.bind(that)}>重置</a>
                                    </div>
                                </table>
                            </div>
                            <div className="table-cont">
                                <table>
                                    <thead>
                                    <tr>
                                        <th className="text-left fans">模板编号</th>
                                        <th>名称</th>
                                        <th>资源平台</th>
                                        <th>查询/充值</th>
                                        <th>话费/水电煤</th>
                                        <th>空充类型</th>
                                        <th>开发人</th>
                                        <th>链接地址</th>
                                        <th>最近更新时间</th>
                                        <th>资源详情</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {that._renderTplInfoList()}
                                    </tbody>
                                </table>
                            </div>
                            <Paging pageNum = {appStore.data().getIn(['tplData','pageNum'])} totalCount = {appStore.data().getIn(['tplData','totalCount'])} pageSize = {appStore.data().getIn(['tplData','pageSize'])} callBack={that._changePage}/>
                            <div className="modal fade alertEditTextPic" id="alertEditTextPic" tabIndex="-1" role="dialog">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                            <h4 className="modal-title">新增详情</h4>
                                        </div>
                                        <div className="modal-body">
                                            <ul>
                                                <li>
                                                    <div className="inline">
                                                        <h5>模板编号</h5>
                                                        <input type="text" placeholder="模板编号" value={appStore.data().get("tpl_id")} onChange={that._changeTplId} />
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="inline">
                                                        <h5>模板名称</h5>
                                                        <input type="text" placeholder="模板名称" value={appStore.data().get("tpl_name")} onChange={that._changeTplName} />
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="inline labelBlock">
                                                        <h5>资源平台</h5>
                                                        <label className="radio-class">
                                                            <input type="radio" checked={appStore.data().get("wy_or_jk") == 1 ? "checked" : ""} onClick={that._changeRadio.bind(that, 'wy_or_jk', 1)} />
                                                            <span>网页</span>
                                                        </label>
                                                        <label className="radio-class">
                                                            <input type="radio" checked={appStore.data().get("wy_or_jk") == 2 ? "checked" : ""} onClick={that._changeRadio.bind(that, 'wy_or_jk', 2)} />
                                                            <span>接口</span>
                                                        </label>
                                                        <label className="radio-class">
                                                            <input type="radio" checked={appStore.data().get("wy_or_jk") == 3 ? "checked" : ""} onClick={that._changeRadio.bind(that, 'wy_or_jk', 3)} />
                                                            <span>空充</span>
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="inline labelBlock">
                                                        <h5>查询/充值</h5>
                                                        <label className="radio-class">
                                                            <input type="radio" checked={appStore.data().get("cx_or_cz") == 1 ? "checked" : ""} onClick={that._changeRadio.bind(that, 'cx_or_cz', 1)} />
                                                            <span>查询</span>
                                                        </label>
                                                        <label className="radio-class">
                                                            <input type="radio" checked={appStore.data().get("cx_or_cz") == 2 ? "checked" : ""} onClick={that._changeRadio.bind(that, 'cx_or_cz', 2)} />
                                                            <span>充值</span>
                                                        </label>
                                                    </div>
                                                </li>
                                                {
                                                    appStore.data().get("wy_or_jk") == 3 ?
                                                        <li>
                                                            <div className="inline labelBlock">
                                                                <h5>空充类型</h5>
                                                                <label className="radio-class">
                                                                    <input type="radio" checked={appStore.data().get("kzcz_type") == 1 ? "checked" : ""} onClick={that._changeRadio.bind(that, 'kzcz_type', 1)} />
                                                                    <span>短信</span>
                                                                </label>
                                                                <label className="radio-class">
                                                                    <input type="radio" checked={appStore.data().get("kzcz_type") == 2 ? "checked" : ""} onClick={that._changeRadio.bind(that, 'kzcz_type', 2)} />
                                                                    <span>拨号</span>
                                                                </label>
                                                                <label className="radio-class">
                                                                    <input type="radio" checked={appStore.data().get("kzcz_type") == 3 ? "checked" : ""} onClick={that._changeRadio.bind(that, 'kzcz_type', 3)} />
                                                                    <span>STK</span>
                                                                </label>
                                                            </div>
                                                        </li> : ""
                                                }
                                                <li>
                                                    <div className="inline">
                                                        <h5>资源网站</h5>
                                                        <input type="text" placeholder="资源网站" value={appStore.data().get("link")} onChange={that._changeLink} />
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="inline">
                                                        <h5>模板归属</h5>
                                                        <select name=""  onChange={that._changeExecuteName}>
                                                            <option value="" selected={appStore.data().get("execute_name") == "" ? "selected" : ""}>--------请选择--------</option>
                                                            {that._renderExecuteNameList()}
                                                        </select>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className="ctt sentCtt">
                                                <h4>
                                                    <a href="javascript:void(0);" onClick={that._changeTabType.bind(that, "text")} className={appStore.data().get("chooseTabType") == "text" ? "text active" : "text"}>文字</a>
                                                    <a href="javascript:void(0);" onClick={that._changeTabType.bind(that, "pic")}  className={appStore.data().get("chooseTabType") == "pic" ? "pic active" : "pic"}>图片</a>
                                                </h4>
                                                {
                                                    appStore.data().get("chooseTabType") == "text" ?
                                                        <div className="modal-text">
                                                            <div className="modal-body">
                                                                <div className="pull-new">
                                                                    <div className="pull-new-body">
                                                                        <textarea className="form-input" name="" id="" cols="30" rows="10" value={appStore.data().get("tpl_content")} onChange={that._changeTplContent}></textarea>
                                                                    </div>
                                                                    <div className="pull-new-foot">
                                                                        <div className="foot-right">
                                                                            <p>{"还可以输入" + (300 - appStore.data().get("tpl_content").length) + "字，按下Enter键换行"}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> : ""
                                                }
                                                {
                                                    appStore.data().get("chooseTabType") == "pic" ?
                                                        <div className="pd choose">
                                                            <p className="upload">
                                                                <a href="javascript:void(0);" title="上传图片">
                                                                    <span>添加图片</span><br/>
                                                                    <i className="iconfont icon-plus"></i>
                                                                </a>
                                                                <input type="file" accept="image/png,image/gif,image/jpeg,image/bmp,image/jpg" name="fileUpload"/>
                                                            </p>
                                                        </div> : ""
                                                }
                                            </div>
                                            <a className="btn-bg ensure" onClick={that._saveTask.bind(that)} data-dismiss="modal" aria-label="Close">确定</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    _renderTplInfoList() {
        let that = this;
        if (appStore.data().getIn(['tplData','dataList']).toJS() != null) {
            return (
                appStore.data().getIn(['tplData', 'dataList']).toJS().map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>{item.tpl_id}</td>
                            <td>{item.tpl_name}</td>
                            <td>
                                {
                                    item.wy_or_jk == 1 ? "网页" :
                                        item.wy_or_jk == 2 ? "接口" : "空充"
                                }
                            </td>
                            <td>{item.cx_or_cz == 1 ? "查询" : "充值"}</td>
                            <td>{item.hf_or_sdm == 1 ? "话费" : item.hf_or_sdm == 2 ? "公共事业" : "综合"}</td>
                            <td>{item.kzcz_type == 1 ? "短信" : item.kzcz_type == 2 ? "拨号" : item.kzcz_type == 3 ? "STK" : "-"}</td>
                            <th>{item.execute_name}</th>
                            <th>{item.link}</th>
                            <th>{new Date(item.modify_time).format('yyyy-MM-dd hh:mm:ss')}</th>
                            <td><a className="col-blue" href="javascript:void(0)" onClick={that._editTplInfo.bind(that, item)}>详情</a></td>
                        </tr>
                    )
                })
            )
        }
    }

    _changeLink(e) {
        appStore.cursor().withMutations(cursor => {
            cursor.set('link', e.target.value);
        });
    }

    _addTplInfo() {
        this.initDialg();
        $("#alertEditTextPic").modal("show");
    }

    _change_tpl_Id(e) {
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['chooseForm','tpl_id'], e.target.value);
        });
    }

    _change_cx_or_cz(e) {
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['chooseForm','cx_or_cz'], e.target.value);
        });
    }

    _change_execute_name(e) {
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['chooseForm','execute_name'], e.target.value);
        });
    }

    _renderChangeExecuteNameList() {
        let that = this;
        return (
            appStore.data().get("userList").map((item, index) => {
                if (item.authority == 3 || item.authority == 1) {
                    return (
                        <option value={item.nick_name} selected={appStore.data().getIn(['chooseForm','execute_name']) == item.nick_name ? "selected" : ""} key={index}>{item.nick_name}</option>
                    )
                }
            })
        )
    }

    _change_tpl_name(e) {
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['chooseForm','tpl_name'], e.target.value);
        });
    }

    _change_hf_or_sdm(e) {
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['chooseForm','hf_or_sdm'], e.target.value);
        });
    }

    _searchList() {
        Messages.emit("TplInfo:queryList");
    }

    _resetChooseForm() {
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['chooseForm', 'tpl_id'], "");
            cursor.setIn(['chooseForm', 'cx_or_cz'], 0);
            cursor.setIn(['chooseForm', 'tpl_name'], "");
            cursor.setIn(['chooseForm', 'hf_or_sdm'], 0);
            cursor.setIn(['chooseForm', 'execute_name'], "");
            cursor.setIn(['tplData', 'pageNum'], 1);
            cursor.setIn(['tplData', 'pageSize'], 5);
        });
    }

    _changePage(newPageNum){
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['tplData','pageNum'], newPageNum);
        });
        Messages.emit("TplInfo:queryList");
    }

    _changeTplId(e) {
        appStore.cursor().withMutations(cursor => {
            cursor.set('tpl_id', e.target.value);
        });
    }

    _changeTplName(e) {
        appStore.cursor().withMutations(cursor => {
            cursor.set('tpl_name', e.target.value);
        });
    }

    _saveTask() {
        Messages.emit('TplInfo:saveTask');
    }

    _changeRadio(set, type) {
        appStore.cursor().withMutations(cursor => {
            if (set == 'wy_or_jk') {
                cursor.set('wy_or_jk', type);
                cursor.set("kzcz_type", 0);
            } else if (set == 'cx_or_cz') {
                cursor.set('cx_or_cz', type);
            } else if (set == 'kzcz_type') {
                cursor.set('kzcz_type', type);
            } else if (set == 'hf_or_sdm') {
                cursor.set('hf_or_sdm', type);
            }
        });
    }

    _changeExecuteName(e) {
        appStore.cursor().withMutations(cursor => {
            cursor.set('execute_name', e.target.value);
        });
    }

    _renderExecuteNameList() {
        let that = this;
        return (
            appStore.data().get("userList").map((item, index) => {
                if (item.authority == 3 || item.authority == 1) {
                    return (
                        <option value={item.nick_name} selected={appStore.data().get("execute_name") == item.nick_name ? "selected" : ""} key={index}>{item.nick_name}</option>
                    )
                }
            })
        )
    }

    _changeTabType(tab) {
        appStore.cursor().withMutations(cursor => {
            cursor.set('chooseTabType', tab);
        });
    }

    _changeTplContent(e) {
        appStore.cursor().withMutations(cursor => {
            cursor.set('tpl_content', e.target.value);
        });
    }

    initDialg() {
        appStore.cursor().withMutations(cursor => {
            cursor.set('flow_id', '');
            cursor.set('tpl_id', '');
            cursor.set('tpl_name', '');
            cursor.set('wy_or_jk', 1);
            cursor.set('cx_or_cz', 1);
            cursor.set('hf_or_sdm', 1);
            cursor.set('tpl_content', '');
        });
    }

    _editTplInfo(item) {
        this.initDialg();
        appStore.cursor().withMutations( cursor => {
            cursor.set("flow_id", item.flow_id);
            cursor.set("tpl_id", item.tpl_id);
            cursor.set("tpl_name", item.tpl_name);
            cursor.set("wy_or_jk", item.wy_or_jk);
            cursor.set("cx_or_cz", item.cx_or_cz);
            cursor.set("hf_or_sdm", item.hf_or_sdm);
            cursor.set("execute_name", item.execute_name);
            cursor.set("link", item.link);
            cursor.set("kzcz_type", item.kzcz_type);
            cursor.set("tpl_content", item.tpl_content == null ? "" : item.tpl_content);
        });
        $("#alertEditTextPic").modal("show");
    }
}

export default withRouter(connectToStore(appStore, true)(TplInfo));