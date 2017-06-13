/**
 * Created with 李雪洋.
 * 2017-05-05
 */
import React from "react";
import {msg as Messages, connectToStore} from "iflux";
import {Link, withRouter} from "react-router";
import appStore from "./store";

class Login extends React.Component {

  componentDidMount() {
      document.onkeydown = keyListener;
      function keyListener(e) {
          if(e.keyCode == 13) {
              Messages.emit("Home:Login");
          }
      }

  }

  render() {
      let that = this;
      return (
          <div>
              <div className="logo_box">
                  <h3>外挂BUG及开发信息提交平台</h3>
                  <form action="#" name="f" method="post">
                      <div className="input_outer">
                          <span className="u_user"></span>
                          <input name="logname" className="text" onFocus={that._bindName.bind(that, 1)} onBlur={that._bindName.bind(that, 0)} onChange={that._changeName} value={appStore.data().get("userName")} style={{color: "#FFFFFF !important"}} type="text" />
                      </div>
                      <div className="input_outer">
                          <span className="us_uer"></span>
                          <label className="l-login login_password">输入密码</label>
                          <input name="logpass" className="text" onFocus={that._bindPwd.bind(that, 1)} onBlur={that._bindPwd.bind(that, 0)} onChange={that._changePwd} value={appStore.data().get("password")} type="password" />
                      </div>
                      <div className="mb2"><a className="act-but submit" href="javascript:void(0)" style={{color: "#FFFFFF"}} onClick={that._loginClick.bind(that)}>登录</a></div>
                  </form>
                  <div className="sas">
                      <a href="javascript:void(0)" style={{fontSize: "10px", float: "left"}}>忘记密码？</a>
                      <a href="javascript:void(0)" style={{fontSize: "10px", float: "right"}}>立即注册</a>
                  </div>
              </div>
          </div>
      )
  }

  _changeName(e) {
      appStore.cursor().withMutations(cursor => {
          cursor.set('userName', e.target.value);
      });
  }

  _bindName(type) {
      appStore.cursor().withMutations(cursor => {
          if (type == 1) {
              if (appStore.data().get("userName") == '输入ID或用户名登录') {
                  cursor.set('userName', "");
              }
          } else {
              if (appStore.data().get("userName") == '') {
                  cursor.set('userName', "输入ID或用户名登录");
              }
          }
      });
  }

  _changePwd(e) {
      appStore.cursor().withMutations(cursor => {
          cursor.set('password', e.target.value);
      });
  }

  _bindPwd(type) {
      if (type == 1) {
          $('.login_password').hide();
      } else {
          if (appStore.data().get("password") == '') {
              $('.login_password').show();
          }
      }
  }

  _loginClick() {
      Messages.emit("Home:Login");
  }

}

export default withRouter(connectToStore(appStore,true)(Login));