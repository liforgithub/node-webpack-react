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
                    cb(null, require('./modules/maintainInfo'))
                })
            }
        }],
        childRoutes: [
            { path: '/maintainInfo',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('./modules/maintainInfo'))
                    })
                }
            },
            { path: '/myTaskInfo',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('./modules/myTaskInfo'))
                    })
                }
            },
            { path: '/tplInfo',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('./modules/tplInfo'))
                    })
                }
            },
        ]
    }]
};
render(<Router history={history} routes={rootRoute}/>, document.getElementById('content'));