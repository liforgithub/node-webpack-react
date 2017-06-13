/**
 * Created with 李雪洋.
 * 2017-05-05
 */
import React from 'react';
import { render } from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
const history = useRouterHistory(createHashHistory)({queryKey: false})

const rootRoute = {
    component: '',
    childRoutes: [{
        path: '/',
        component: require('./modules/main'),
        indexRoute: [{
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('./modules/login'))
                })
            }
        }],
        childRoutes: [
            { path: '/login',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('./modules/login'))
                    })
                }
            },
        ]
    }]
};
render(<Router history={history} routes={rootRoute}/>, document.getElementById('content'));