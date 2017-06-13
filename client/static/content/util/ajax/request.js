/**
 * ajax get
 * @param url
 * @param data
 * @param _context
 * @returns {*}
 */
'useStrict'

let immutable = require('immutable');
let request = function(){};
module.exports = request;

request.get = function(url, data, _context) {
    let deferred = $.Deferred();

    let ctx = _context || this;

    let params = data || {};

    $.ajax({
        url:url,
        type:"GET",
        data:params,
        success:function(resp){
            resp.result === "ok" ? deferred.resolveWith(ctx, [resp.data]) : deferred.rejectWith(ctx, [resp]);
        },
        error:function(resq){
            deferred.rejectWith(ctx, [resq]);
        }
    });
    return deferred.promise();
};
/**
 * ajax get
 * @param url
 * @param data
 * @param _context
 * @returns {*}
 */
request.ajax = function(url, data, _context) {
    let deferred = $.Deferred();
    if(!requestControl(data,url)){
        return deferred.promise();
    }

    let ctx = _context || this;

    let params = data || {};

    $.ajax({
        url:url,
        type:"GET",
        data:params,
        success:function(resp){
            resp.result === "ok" ? deferred.resolveWith(ctx, [resp.data]) : deferred.rejectWith(ctx, [resp]);
        },
        error:function(resq){
            deferred.rejectWith(ctx, [resq]);
        }
    });
    return deferred.promise();
};
/**
 * ajax post
 * @param url
 * @param data
 * @param _context
 * @returns {*}
 */
request.post = function(url, data, _context, _config) {
    let deferred = $.Deferred();
    if(!requestControl(data,url)){
        return deferred.promise();
    }

    let ctx = _context || this;
    let params = data || {};

    let _option = {
        url:url,
        type:"POST",
        data:params,
        success:function(resp){
            resp.result === "ok" ? deferred.resolveWith(ctx, [resp.data]) : deferred.rejectWith(ctx, [resp]);
        },
        error:function(resq){
            deferred.rejectWith(ctx, [resq]);
        }
    };
    for(let key in _config){
        _option[key] = _config[key];
    }
    $.ajax(_option);
    return deferred.promise();
};

/**
 * ajax post
 * @param url
 * @param data
 * @param _context
 * @returns {*}
 */
request.put = function(url, data, _context) {
    let deferred = $.Deferred();
    if(!requestControl(data,url)){
        return deferred.promise();
    }

    let ctx = _context || this;
    let params = data || {};

    $.ajax({
        url:url,
        type:"PUT",
        data:params,
        success:function(resp){
            resp.result === "ok" ? deferred.resolveWith(ctx, [resp.data]) : deferred.rejectWith(ctx, [resp]);
        },
        error:function(resq){
            deferred.rejectWith(ctx, [resq]);
        }
    });
    return deferred.promise();
};

/**
 * ajax delete
 * @param url
 * @param data
 * @param _context
 * @returns {*}
 */
request.delete = function(url, data, _context) {
    let deferred = $.Deferred();
    if(!requestControl(data,url)){
        return deferred.promise();
    }

    let ctx = _context || this;
    let params = data || {};

    $.ajax({
        url:url,
        type:"DELETE",
        data:params,
        success:function(resp){
            resp.result === "ok" ? deferred.resolveWith(ctx, [resp.data]) : deferred.rejectWith(ctx, [resp]);
        },
        error:function(resq){
            deferred.rejectWith(ctx, [resq]);
        }
    });

    return deferred.promise();
};

/**
 * 请求处理器，1秒内仅允许一次请求*/
let arr = new Array();
let t = 1000;//同一请求1秒内只允许一次
function requestControl(params,url){
    let obj = immutable.fromJS({params:params,url:url});
    let _index = arr.length;
    for(let _i in arr){
        if(immutable.is(arr[_i].target,obj)){
            let times = arr[_i].times;
            if(new Date().getTime() - times >= t){
                _index = _i;
                break;
            }else{
                arr = arr.splice(_i,_index - _i);
                return false;//停止此次请求
            }
        }
    }
    arr[_index] = {times:new Date().getTime(),target:obj};
    return true;
}
