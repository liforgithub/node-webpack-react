/**
 * Created by 李雪洋 on 2017/5/11.
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

class Home extends React.Component {

    componentWillMount(){
        Messages.emit('Home:queryList');
        Messages.emit('Home:queryUserList');
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
                        <h3>信息管理</h3>
                        <div className="content">
                            <ul className="tab-li">
                                <li><a href="javascript:void(0)" title="开发&维护需求">开发&维护需求</a></li>
                                {
                                    CommonInfo.getUserInfo().authority < 3 ? <a className="pull-right btn btn-sm btn-primary" onClick={that._addTask.bind(that)}>添加需求</a> : ""
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
                                            <div className="search-left">外挂属性：</div>
                                            <div className="search-right">
                                                <select name="" className="form-input" onChange={that._change_cx_or_cz.bind(that)}>
                                                    <option value="0" selected={appStore.data().getIn(['chooseForm','cx_or_cz']) == 0 ? "selected" : ""}>--------请选择--------</option>
                                                    <option value="1" selected={appStore.data().getIn(['chooseForm','cx_or_cz']) == 1 ? "selected" : ""}>查询</option>
                                                    <option value="2" selected={appStore.data().getIn(['chooseForm','cx_or_cz']) == 2 ? "selected" : ""}>充值</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="search-left">创建人：</div>
                                            <div className="search-right">
                                                <select name="" className="form-input" onChange={that._change_create_name.bind(that)}>
                                                    <option value="" selected={appStore.data().getIn(['chooseForm','create_name']) == "" ? "selected" : ""}>--------请选择--------</option>
                                                    {that._renderChangeCreateNameList()}
                                                </select>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="search-left">处理状态：</div>
                                            <div className="search-right">
                                                <select name="" className="form-input" onChange={that._change_state.bind(that)}>
                                                    <option value="0" selected={appStore.data().getIn(['chooseForm','state']) == "0" ? "selected" : ""}>--------请选择--------</option>
                                                    <option value="1" selected={appStore.data().getIn(['chooseForm','state']) == "1" ? "selected" : ""}>处理中</option>
                                                    <option value="2" selected={appStore.data().getIn(['chooseForm','state']) == "2" ? "selected" : ""}>已完成</option>
                                                    <option value="3" selected={appStore.data().getIn(['chooseForm','state']) == "3" ? "selected" : ""}>已废弃</option>
                                                    <option value="4" selected={appStore.data().getIn(['chooseForm','state']) == "4" ? "selected" : ""}>未分配</option>
                                                    <option value="5" selected={appStore.data().getIn(['chooseForm','state']) == "5" ? "selected" : ""}>已分配</option>
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
                                            <div className="search-left">外挂范围：</div>
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
                                            <div className="search-left">处理人：</div>
                                            <div className="search-right">
                                                <select name="" className="form-input" onChange={that._change_execute_name.bind(that)}>
                                                    <option value="" selected={appStore.data().getIn(['chooseForm','execute_name']) == "0" ? "selected" : ""}>--------请选择--------</option>
                                                    {that._renderChangeExecuteNameList()}
                                                </select>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="search-left">创建时间：</div>
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
                                        <th className="text-left fans">任务类型</th>
                                        <th>模板编号</th>
                                        <th>名称</th>
                                        <th>资源平台</th>
                                        <th>查询/充值</th>
                                        <th>话费/水电煤</th>
                                        <th>空充类型</th>
                                        <th>添加时间</th>
                                        <th>添加人</th>
                                        <th>分配给</th>
                                        <th>状态</th>
                                        <th>完成时间</th>
                                        {CommonInfo.getUserInfo().authority < 3 ? <th>需求详情</th> : ""}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {that._renderTaskList()}
                                    </tbody>
                                </table>
                            </div>
                            <Paging pageNum = {appStore.data().getIn(['taskData','pageNum'])} totalCount = {appStore.data().getIn(['taskData','totalCount'])} pageSize = {appStore.data().getIn(['taskData','pageSize'])} callBack={that._changePage}/>
                            <div className="modal fade alertEditTextPic" id="alertEditTextPic" tabIndex="-1" role="dialog">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                            <h4 className="modal-title">添加任务</h4>
                                            {
                                                CommonInfo.getUserInfo().authority < 3 && appStore.data().get("flow_id") != "" ?
                                                <a className="fr" data-toggle="modal" data-target="#alertDel">删除任务</a> : ""
                                            }
                                        </div>
                                        <div className="modal-body">
                                            <ul>
                                                <li>
                                                    <div className="inline labelBlock">
                                                        <h5>任务类别</h5>
                                                        <label className="radio-class">
                                                            <input type="radio" checked={appStore.data().get("task_type") == 1 ? "checked" : ""} onClick={that._changeRadio.bind(that, 'task_type', 1)} />
                                                            <span>维护</span>
                                                        </label>
                                                        <label className="radio-class">
                                                            <input type="radio" checked={appStore.data().get("task_type") == 2 ? "checked" : ""} onClick={that._changeRadio.bind(that, 'task_type', 2)} />
                                                            <span>开发</span>
                                                        </label>
                                                    </div>
                                                </li>
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
                                                <li>
                                                    <div className="inline labelBlock">
                                                        <h5>话费/水电煤</h5>
                                                        <label className="radio-class">
                                                            <input type="radio" checked={appStore.data().get("hf_or_sdm") == 1 ? "checked" : ""} onClick={that._changeRadio.bind(that, 'hf_or_sdm', 1)} />
                                                            <span>话费</span>
                                                        </label>
                                                        <label className="radio-class">
                                                            <input type="radio" checked={appStore.data().get("hf_or_sdm") == 2 ? "checked" : ""} onClick={that._changeRadio.bind(that, 'hf_or_sdm', 2)} />
                                                            <span>水电煤</span>
                                                        </label>
                                                        <label className="radio-class">
                                                            <input type="radio" checked={appStore.data().get("hf_or_sdm") == 3 ? "checked" : ""} onClick={that._changeRadio.bind(that, 'hf_or_sdm', 3)} />
                                                            <span>综合</span>
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
                                                        <h5>添加人</h5>
                                                        <input type="text" placeholder="添加人" value={appStore.data().get("create_name") == "" ? CommonInfo.getUserInfo().nickName : appStore.data().get("create_name")} disabled="disabled" />
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="inline">
                                                        <h5>分配给</h5>
                                                        <select name=""  onChange={that._changeExecuteName}>
                                                            <option value="" selected={appStore.data().get("execute_name") == "" ? "selected" : ""}>--------请选择--------</option>
                                                            {that._renderExecuteNameList()}
                                                        </select>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="inline">
                                                        <h5>状态</h5>
                                                        <select name="" className="form-input" onChange={that._changeState.bind(that)}>
                                                            <option value="0" selected={appStore.data().get("state") == 0 ? "selected" : ""}>--------请选择--------</option>
                                                            <option value="1" selected={appStore.data().get("state") == 1 ? "selected" : ""}>处理中</option>
                                                            <option value="2" selected={appStore.data().get("state") == 2 ? "selected" : ""}>已完成</option>
                                                            <option value="3" selected={appStore.data().get("state") == 3 ? "selected" : ""}>已废弃</option>
                                                            <option value="4" selected={appStore.data().get("state") == 4 ? "selected" : ""}>未分配</option>
                                                            <option value="5" selected={appStore.data().get("state") == 5 ? "selected" : ""}>已分配</option>
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
                                                                        <textarea className="form-input" name="" id="" cols="30" rows="10" value={appStore.data().get("task_content")} onChange={that._changeTaskContent}></textarea>
                                                                    </div>
                                                                    <div className="pull-new-foot">
                                                                        <div className="foot-right">
                                                                            <p>{"还可以输入" + (300 - appStore.data().get("task_content").length) + "字，按下Enter键换行"}</p>
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
                            <Confirm title="是否确定删除？" text="刪除" id="alertDel" callBack={that._deleteTask.bind(that)}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    _renderTaskList() {
        let that = this;
        if (appStore.data().getIn(['taskData','dataList']).toJS() != null) {
            return (
                appStore.data().getIn(['taskData', 'dataList']).toJS().map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>{item.task_type == 1 ? "维护" : "开发"}</td>
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
                            <td>{new Date(item.create_time).format('yyyy-MM-dd hh:mm:ss')}</td>
                            <td>{item.create_name}</td>
                            <td>{item.execute_name}</td>
                            {
                                item.state == 1 ?
                                    <td style={{color: "red"}}>处理中</td> :
                                    item.state == 2 ?
                                        <td style={{color: "green"}}>已完成</td> :
                                        item.state == 3 ?
                                            <td style={{color: "#ADADAD"}}>已废弃</td> :
                                            item.state == 4 ?
                                                <td style={{color: "blue"}}>未分配</td> :
                                                item.state == 5 ?
                                                <td style={{color: "#8600ff"}}>已分配</td> : <td>未处理</td>
                            }
                            <td>{item.complated_time != null ? new Date(item.complated_time).format('yyyy-MM-dd hh:mm:ss') : "-"}</td>
                            {
                                CommonInfo.getUserInfo().authority < 3 ? <td><a className="col-blue" href="javascript:void(0)" onClick={that._editTplInfo.bind(that, item)}>详情</a></td> : ""
                            }
                        </tr>
                    )
                })
            )
        }
    }

    _resetChooseForm() {
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['chooseForm', 'tpl_id'], "");
            cursor.setIn(['chooseForm', 'cx_or_cz'], 0);
            cursor.setIn(['chooseForm', 'create_name'], "");
            cursor.setIn(['chooseForm', 'state'], 0);
            cursor.setIn(['chooseForm', 'tpl_name'], "");
            cursor.setIn(['chooseForm', 'hf_or_sdm'], 0);
            cursor.setIn(['chooseForm', 'execute_name'], "");
            cursor.setIn(['chooseForm', 'create_time'], "");
            cursor.setIn(['taskData', 'pageNum'], 1);
            cursor.setIn(['taskData', 'pageSize'], 5);
        });
    }

    _changeTaskContent(e) {
        appStore.cursor().withMutations(cursor => {
            cursor.set('task_content', e.target.value);
        });
    }

    _changeTabType(tab) {
        appStore.cursor().withMutations(cursor => {
            cursor.set('chooseTabType', tab);
        });
    }

    _changeState(e) {
        appStore.cursor().withMutations(cursor => {
            cursor.set('state', e.target.value);
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

    _deleteTask() {
        Messages.emit("Home:deleteTask");
        $("#alertEditTextPic").modal("hide");
    }

    initDialg() {
        appStore.cursor().withMutations(cursor => {
            cursor.set('flow_id', '');
            cursor.set('tpl_id', '');
            cursor.set('tpl_name', '');
            cursor.set('task_type', 1);
            cursor.set('wy_or_jk', 1);
            cursor.set('cx_or_cz', 1);
            cursor.set('hf_or_sdm', 1);
            cursor.set('kzcz_type', 0);
            cursor.set('create_name', 0);
            cursor.set('state', 0);
            cursor.set('task_content', '');
        });
    }

    _addTask() {
        this.initDialg();
        $("#alertEditTextPic").modal("show");
    }

    _editTplInfo(item) {
        this.initDialg();
        appStore.cursor().withMutations( cursor => {
            cursor.set("flow_id", item.flow_id);
            cursor.set("tpl_id", item.tpl_id);
            cursor.set("tpl_name", item.tpl_name);
            cursor.set("wy_or_jk", item.wy_or_jk);
            cursor.set("task_type", item.task_type);
            cursor.set("cx_or_cz", item.cx_or_cz);
            cursor.set("hf_or_sdm", item.hf_or_sdm);
            cursor.set("kzcz_type", item.kzcz_type);
            cursor.set("create_name", item.create_name);
            cursor.set("execute_name", item.execute_name);
            cursor.set("state", item.state);
            cursor.set("task_content", item.task_content == null ? "" : item.task_content);
        });
        $("#alertEditTextPic").modal("show");
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

    _change_execute_name(e) {
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['chooseForm','execute_name'], e.target.value);
        });
    }

    _change_hf_or_sdm(e) {
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['chooseForm','hf_or_sdm'], e.target.value);
        });
    }

    _change_tpl_name(e) {
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['chooseForm','tpl_name'], e.target.value);
        });
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

    _renderChangeCreateNameList() {
        let that = this;
        return (
            appStore.data().get("userList").map((item, index) => {
                if (item.authority == 1 || item.authority == 2) {
                    return (
                        <option value={item.nick_name} selected={appStore.data().getIn(['chooseForm','create_name']) == item.nick_name ? "selected" : ""} key={index}>{item.nick_name}</option>
                    )
                }
            })
        )
    }

    _change_create_name(e) {
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['chooseForm','create_name'], e.target.value);
        });
    }

    _change_state(e) {
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['chooseForm','state'], e.target.value);
        });
    }

    _searchList() {
        Messages.emit("Home:queryList");
    }

    _changePage(newPageNum){
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['taskData','pageNum'], newPageNum);
        });
        Messages.emit("Home:queryList");
    }

    _changeRadio(set, type) {
        appStore.cursor().withMutations(cursor => {
            if (set == 'task_type') {
                cursor.set('task_type', type);
            } else if (set == 'wy_or_jk') {
                cursor.set('wy_or_jk', type);
            } else if (set == 'cx_or_cz') {
                cursor.set('cx_or_cz', type);
            } else if (set == 'hf_or_sdm') {
                cursor.set('hf_or_sdm', type);
            } else if (set == 'kzcz_type') {
                cursor.set('kzcz_type', type);
            }
        });
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
        Messages.emit('Home:saveTask');
    }
}

export default withRouter(connectToStore(appStore,true)(Home));