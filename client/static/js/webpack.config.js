/**
 * Created by 李雪洋 2017/5/5
 */
'use strict'
let assetsViews = require('./assets-views');
let targetPath = '../../static/js/build';

module.exports = {
    entry: {
        'app':['babel-polyfill','app.js']
    },
    resolve: {
        modulesDirectories: ['', 'common','node_modules']
    },
    output: {
    path: targetPath,
    filename: 'node-[name].js',
    publicPath: '/js/build/'
},

module: {
    loaders: [
        {test: /\.js$/, loader: 'babel-loader?stage=0&blacklist=strict'}
    ]
},
plugins: [
    assetsViews({
        from: './views/',
        to: '../../WEB-INF/html/'
    })
]
};