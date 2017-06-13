#项目框架简介

本框架基于nodejs搭建,利用express框架快速搭建web服务器

应用技术
后台：
    express
    mysql
前端：
    react
    webpack
    ejs(虽然使用的是html)
    TypeScript

#启动项目

1.首先要安装nodejs(官网 https://nodejs.org/en/ 现在最新版本（目前是7.10.0）)
    安装完成后要设置环境变量（Path里面添加nodejs安装路径）

2.拷贝工程到对应文件夹，打开项目（推荐最新版WebStorm，老版不支持typeScript）

3.初始化工程
    首先进入工程根目录，cmd打开DOS界面，npm install一下，安装nodejs依赖包
    再进入client/static/js，npm install一下，安装前端依赖包
    完成后，全局安装webpack， npm install webpack@1.12.0 -g

4.启动工程生成必要js
    进入client/static/js目录， cmd打开DOS，执行webpack，提示生成成功即完成打包动作

5.进入bin目录，右键www，启动项目，没有报错并且有日志打印即为启动成功

6.打开浏览器，输入localhost:3000/访问即可