webpackJsonp([3],{

/***/ 546:
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  Store: __webpack_require__(547),
	  connectToStore: __webpack_require__(551),
	  Validator: __webpack_require__(552),
	  msg: __webpack_require__(553),
	  mixins: {
	    StoreMixin: __webpack_require__(555)
	  }
	};

/***/ },

/***/ 547:
/***/ function(module, exports, __webpack_require__) {

	var Immutable = __webpack_require__(548);
	var Cursor = __webpack_require__(549);
	var _ = __webpack_require__(550);

	/**
	 * 封装应用的核心Store，使用Immutable来trace change
	 *
	 * immutable真是和React是绝配啊，最初只是看到Om的架构
	 * 感觉真是非常简洁，充分利用Clojure的数据结构的特性
	 * 1. 不可变 2. 持久化数据结构 3. cursor局部更新数据
	 *
	 * 一直寻找这样的方案，对于Immutable.js如获至宝。所以
	 * 对于Reactconf2015最期待的就是Immutable的分享。
	 *
	 * immutable使我们对于变化的跟踪变得更简单，且不变的数据共享
	 * 又兼顾性能。
	 */
	module.exports = Store;

	/**
	 * 数据中心
	 *
	 * @param obj
	 */
	function Store(data) {
	  if (!(this instanceof Store)) return new Store(data);

	  //当前应用的数据
	  this.data = Immutable.fromJS(data || {});

	  //缓存初始状态的值
	  this.init = this.data;

	  //注册store change的callback
	  this.callbacks = [];

	  /**
	   * 暴露给外面的方法
	   */
	  return {
	    data: this.getData.bind(this),
	    onStoreChange: this.onStoreChange.bind(this),
	    removeStoreChange: this.removeStoreChange.bind(this),
	    cursor: this.cursor.bind(this),
	    reset: this.reset.bind(this)
	  };
	}

	/**
	 * 获取数据
	 */
	Store.prototype.getData = function () {
	  return this.data;
	};

	/**
	 * 获取store中的cursor
	 */
	Store.prototype.cursor = function () {
	  /**
	   * cursor发生变化的回调
	   *
	   * @param nextState 变化后的状态
	   * @param preState 变化前状态
	   * @param path cursor变化的路径
	   */
	  var change = (function (nextState, preState, path) {
	    //检查cursor是不是正在的发生变化
	    if (nextState === preState) {
	      return;
	    }

	    var cpath = path.join() || 'root';

	    _.log('\ncursor:path: [', cpath, ']\n', '\nstore:\n', nextState ? JSON.stringify(nextState.toJSON(), '', 2) : 'is null. (Maybe was deleted.)');

	    //判断是否出现数据不同步的情况
	    if (preState != this.data) {
	      throw new Error('attempted to altere expired data.');
	    }

	    this.data = nextState;

	    this.callbacks.forEach(function (callback) {
	      callback(nextState, path);
	    });
	  }).bind(this);

	  return Cursor.from(this.data, change);
	};

	/**
	 * 绑定Store数据变化的回调
	 */
	Store.prototype.onStoreChange = function (callback) {
	  //防止重复添加
	  for (var i = 0, len = this.callbacks.length; i < len; i++) {
	    if (callback === this.callbacks[i]) {
	      return;
	    }
	  }
	  this.callbacks.push(callback);
	};

	/** 
	 * 解除Store的数据变化的绑定
	 */
	Store.prototype.removeStoreChange = function (callback) {
	  for (var i = 0, len = this.callbacks.length; i < len; i++) {
	    if (this.callbacks[i] == callback) {
	      this.callbacks.splice(i, 1);
	      break;
	    }
	  }
	};

	/**
	 * 重置某个路径下的immutable值
	 *
	 * @param path 数据的路径
	 */
	Store.prototype.reset = function (path) {
	  if (path) {
	    var isArray = _.isArray(path);
	    var initVal = this.init[isArray ? 'getIn' : 'get'](path);

	    //set
	    this.cursor()[isArray ? 'setIn' : 'set'](path, initVal);
	  } else {
	    //如果path为空，整个数据全部回到初始状态
	    this.data = this.init;
	    var self = this;
	    this.callbacks.forEach(function (callback) {
	      callback(self.data);
	    });
	  }
	};

/***/ },

/***/ 548:
/***/ function(module, exports, __webpack_require__) {

	/**
	 *  Copyright (c) 2014-2015, Facebook, Inc.
	 *  All rights reserved.
	 *
	 *  This source code is licensed under the BSD-style license found in the
	 *  LICENSE file in the root directory of this source tree. An additional grant
	 *  of patent rights can be found in the PATENTS file in the same directory.
	 */(function(global,factory){ true?module.exports = factory():typeof define === 'function' && define.amd?define(factory):global.Immutable = factory();})(this,function(){'use strict';var SLICE$0=Array.prototype.slice;function createClass(ctor,superClass){if(superClass){ctor.prototype = Object.create(superClass.prototype);}ctor.prototype.constructor = ctor;}function Iterable(value){return isIterable(value)?value:Seq(value);}createClass(KeyedIterable,Iterable);function KeyedIterable(value){return isKeyed(value)?value:KeyedSeq(value);}createClass(IndexedIterable,Iterable);function IndexedIterable(value){return isIndexed(value)?value:IndexedSeq(value);}createClass(SetIterable,Iterable);function SetIterable(value){return isIterable(value) && !isAssociative(value)?value:SetSeq(value);}function isIterable(maybeIterable){return !!(maybeIterable && maybeIterable[IS_ITERABLE_SENTINEL]);}function isKeyed(maybeKeyed){return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);}function isIndexed(maybeIndexed){return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);}function isAssociative(maybeAssociative){return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);}function isOrdered(maybeOrdered){return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);}Iterable.isIterable = isIterable;Iterable.isKeyed = isKeyed;Iterable.isIndexed = isIndexed;Iterable.isAssociative = isAssociative;Iterable.isOrdered = isOrdered;Iterable.Keyed = KeyedIterable;Iterable.Indexed = IndexedIterable;Iterable.Set = SetIterable;var IS_ITERABLE_SENTINEL='@@__IMMUTABLE_ITERABLE__@@';var IS_KEYED_SENTINEL='@@__IMMUTABLE_KEYED__@@';var IS_INDEXED_SENTINEL='@@__IMMUTABLE_INDEXED__@@';var IS_ORDERED_SENTINEL='@@__IMMUTABLE_ORDERED__@@'; // Used for setting prototype methods that IE8 chokes on.
	var DELETE='delete'; // Constants describing the size of trie nodes.
	var SHIFT=5; // Resulted in best performance after ______?
	var SIZE=1 << SHIFT;var MASK=SIZE - 1; // A consistent shared value representing "not set" which equals nothing other
	// than itself, and nothing that could be provided externally.
	var NOT_SET={}; // Boolean references, Rough equivalent of `bool &`.
	var CHANGE_LENGTH={value:false};var DID_ALTER={value:false};function MakeRef(ref){ref.value = false;return ref;}function SetRef(ref){ref && (ref.value = true);} // A function which returns a value representing an "owner" for transient writes
	// to tries. The return value will only ever equal itself, and will not equal
	// the return of any subsequent call of this function.
	function OwnerID(){} // http://jsperf.com/copy-array-inline
	function arrCopy(arr,offset){offset = offset || 0;var len=Math.max(0,arr.length - offset);var newArr=new Array(len);for(var ii=0;ii < len;ii++) {newArr[ii] = arr[ii + offset];}return newArr;}function ensureSize(iter){if(iter.size === undefined){iter.size = iter.__iterate(returnTrue);}return iter.size;}function wrapIndex(iter,index){ // This implements "is array index" which the ECMAString spec defines as:
	//
	//     A String property name P is an array index if and only if
	//     ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal
	//     to 2^32−1.
	//
	// http://www.ecma-international.org/ecma-262/6.0/#sec-array-exotic-objects
	if(typeof index !== 'number'){var uint32Index=index >>> 0; // N >>> 0 is shorthand for ToUint32
	if('' + uint32Index !== index || uint32Index === 4294967295){return NaN;}index = uint32Index;}return index < 0?ensureSize(iter) + index:index;}function returnTrue(){return true;}function wholeSlice(begin,end,size){return (begin === 0 || size !== undefined && begin <= -size) && (end === undefined || size !== undefined && end >= size);}function resolveBegin(begin,size){return resolveIndex(begin,size,0);}function resolveEnd(end,size){return resolveIndex(end,size,size);}function resolveIndex(index,size,defaultIndex){return index === undefined?defaultIndex:index < 0?Math.max(0,size + index):size === undefined?index:Math.min(size,index);} /* global Symbol */var ITERATE_KEYS=0;var ITERATE_VALUES=1;var ITERATE_ENTRIES=2;var REAL_ITERATOR_SYMBOL=typeof Symbol === 'function' && Symbol.iterator;var FAUX_ITERATOR_SYMBOL='@@iterator';var ITERATOR_SYMBOL=REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;function Iterator(next){this.next = next;}Iterator.prototype.toString = function(){return '[Iterator]';};Iterator.KEYS = ITERATE_KEYS;Iterator.VALUES = ITERATE_VALUES;Iterator.ENTRIES = ITERATE_ENTRIES;Iterator.prototype.inspect = Iterator.prototype.toSource = function(){return this.toString();};Iterator.prototype[ITERATOR_SYMBOL] = function(){return this;};function iteratorValue(type,k,v,iteratorResult){var value=type === 0?k:type === 1?v:[k,v];iteratorResult?iteratorResult.value = value:iteratorResult = {value:value,done:false};return iteratorResult;}function iteratorDone(){return {value:undefined,done:true};}function hasIterator(maybeIterable){return !!getIteratorFn(maybeIterable);}function isIterator(maybeIterator){return maybeIterator && typeof maybeIterator.next === 'function';}function getIterator(iterable){var iteratorFn=getIteratorFn(iterable);return iteratorFn && iteratorFn.call(iterable);}function getIteratorFn(iterable){var iteratorFn=iterable && (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL] || iterable[FAUX_ITERATOR_SYMBOL]);if(typeof iteratorFn === 'function'){return iteratorFn;}}function isArrayLike(value){return value && typeof value.length === 'number';}createClass(Seq,Iterable);function Seq(value){return value === null || value === undefined?emptySequence():isIterable(value)?value.toSeq():seqFromValue(value);}Seq.of = function() /*...values*/{return Seq(arguments);};Seq.prototype.toSeq = function(){return this;};Seq.prototype.toString = function(){return this.__toString('Seq {','}');};Seq.prototype.cacheResult = function(){if(!this._cache && this.__iterateUncached){this._cache = this.entrySeq().toArray();this.size = this._cache.length;}return this;}; // abstract __iterateUncached(fn, reverse)
	Seq.prototype.__iterate = function(fn,reverse){return seqIterate(this,fn,reverse,true);}; // abstract __iteratorUncached(type, reverse)
	Seq.prototype.__iterator = function(type,reverse){return seqIterator(this,type,reverse,true);};createClass(KeyedSeq,Seq);function KeyedSeq(value){return value === null || value === undefined?emptySequence().toKeyedSeq():isIterable(value)?isKeyed(value)?value.toSeq():value.fromEntrySeq():keyedSeqFromValue(value);}KeyedSeq.prototype.toKeyedSeq = function(){return this;};createClass(IndexedSeq,Seq);function IndexedSeq(value){return value === null || value === undefined?emptySequence():!isIterable(value)?indexedSeqFromValue(value):isKeyed(value)?value.entrySeq():value.toIndexedSeq();}IndexedSeq.of = function() /*...values*/{return IndexedSeq(arguments);};IndexedSeq.prototype.toIndexedSeq = function(){return this;};IndexedSeq.prototype.toString = function(){return this.__toString('Seq [',']');};IndexedSeq.prototype.__iterate = function(fn,reverse){return seqIterate(this,fn,reverse,false);};IndexedSeq.prototype.__iterator = function(type,reverse){return seqIterator(this,type,reverse,false);};createClass(SetSeq,Seq);function SetSeq(value){return (value === null || value === undefined?emptySequence():!isIterable(value)?indexedSeqFromValue(value):isKeyed(value)?value.entrySeq():value).toSetSeq();}SetSeq.of = function() /*...values*/{return SetSeq(arguments);};SetSeq.prototype.toSetSeq = function(){return this;};Seq.isSeq = isSeq;Seq.Keyed = KeyedSeq;Seq.Set = SetSeq;Seq.Indexed = IndexedSeq;var IS_SEQ_SENTINEL='@@__IMMUTABLE_SEQ__@@';Seq.prototype[IS_SEQ_SENTINEL] = true;createClass(ArraySeq,IndexedSeq);function ArraySeq(array){this._array = array;this.size = array.length;}ArraySeq.prototype.get = function(index,notSetValue){return this.has(index)?this._array[wrapIndex(this,index)]:notSetValue;};ArraySeq.prototype.__iterate = function(fn,reverse){var array=this._array;var maxIndex=array.length - 1;for(var ii=0;ii <= maxIndex;ii++) {if(fn(array[reverse?maxIndex - ii:ii],ii,this) === false){return ii + 1;}}return ii;};ArraySeq.prototype.__iterator = function(type,reverse){var array=this._array;var maxIndex=array.length - 1;var ii=0;return new Iterator(function(){return ii > maxIndex?iteratorDone():iteratorValue(type,ii,array[reverse?maxIndex - ii++:ii++]);});};createClass(ObjectSeq,KeyedSeq);function ObjectSeq(object){var keys=Object.keys(object);this._object = object;this._keys = keys;this.size = keys.length;}ObjectSeq.prototype.get = function(key,notSetValue){if(notSetValue !== undefined && !this.has(key)){return notSetValue;}return this._object[key];};ObjectSeq.prototype.has = function(key){return this._object.hasOwnProperty(key);};ObjectSeq.prototype.__iterate = function(fn,reverse){var object=this._object;var keys=this._keys;var maxIndex=keys.length - 1;for(var ii=0;ii <= maxIndex;ii++) {var key=keys[reverse?maxIndex - ii:ii];if(fn(object[key],key,this) === false){return ii + 1;}}return ii;};ObjectSeq.prototype.__iterator = function(type,reverse){var object=this._object;var keys=this._keys;var maxIndex=keys.length - 1;var ii=0;return new Iterator(function(){var key=keys[reverse?maxIndex - ii:ii];return ii++ > maxIndex?iteratorDone():iteratorValue(type,key,object[key]);});};ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;createClass(IterableSeq,IndexedSeq);function IterableSeq(iterable){this._iterable = iterable;this.size = iterable.length || iterable.size;}IterableSeq.prototype.__iterateUncached = function(fn,reverse){if(reverse){return this.cacheResult().__iterate(fn,reverse);}var iterable=this._iterable;var iterator=getIterator(iterable);var iterations=0;if(isIterator(iterator)){var step;while(!(step = iterator.next()).done) {if(fn(step.value,iterations++,this) === false){break;}}}return iterations;};IterableSeq.prototype.__iteratorUncached = function(type,reverse){if(reverse){return this.cacheResult().__iterator(type,reverse);}var iterable=this._iterable;var iterator=getIterator(iterable);if(!isIterator(iterator)){return new Iterator(iteratorDone);}var iterations=0;return new Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type,iterations++,step.value);});};createClass(IteratorSeq,IndexedSeq);function IteratorSeq(iterator){this._iterator = iterator;this._iteratorCache = [];}IteratorSeq.prototype.__iterateUncached = function(fn,reverse){if(reverse){return this.cacheResult().__iterate(fn,reverse);}var iterator=this._iterator;var cache=this._iteratorCache;var iterations=0;while(iterations < cache.length) {if(fn(cache[iterations],iterations++,this) === false){return iterations;}}var step;while(!(step = iterator.next()).done) {var val=step.value;cache[iterations] = val;if(fn(val,iterations++,this) === false){break;}}return iterations;};IteratorSeq.prototype.__iteratorUncached = function(type,reverse){if(reverse){return this.cacheResult().__iterator(type,reverse);}var iterator=this._iterator;var cache=this._iteratorCache;var iterations=0;return new Iterator(function(){if(iterations >= cache.length){var step=iterator.next();if(step.done){return step;}cache[iterations] = step.value;}return iteratorValue(type,iterations,cache[iterations++]);});}; // # pragma Helper functions
	function isSeq(maybeSeq){return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);}var EMPTY_SEQ;function emptySequence(){return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));}function keyedSeqFromValue(value){var seq=Array.isArray(value)?new ArraySeq(value).fromEntrySeq():isIterator(value)?new IteratorSeq(value).fromEntrySeq():hasIterator(value)?new IterableSeq(value).fromEntrySeq():typeof value === 'object'?new ObjectSeq(value):undefined;if(!seq){throw new TypeError('Expected Array or iterable object of [k, v] entries, ' + 'or keyed object: ' + value);}return seq;}function indexedSeqFromValue(value){var seq=maybeIndexedSeqFromValue(value);if(!seq){throw new TypeError('Expected Array or iterable object of values: ' + value);}return seq;}function seqFromValue(value){var seq=maybeIndexedSeqFromValue(value) || typeof value === 'object' && new ObjectSeq(value);if(!seq){throw new TypeError('Expected Array or iterable object of values, or keyed object: ' + value);}return seq;}function maybeIndexedSeqFromValue(value){return isArrayLike(value)?new ArraySeq(value):isIterator(value)?new IteratorSeq(value):hasIterator(value)?new IterableSeq(value):undefined;}function seqIterate(seq,fn,reverse,useKeys){var cache=seq._cache;if(cache){var maxIndex=cache.length - 1;for(var ii=0;ii <= maxIndex;ii++) {var entry=cache[reverse?maxIndex - ii:ii];if(fn(entry[1],useKeys?entry[0]:ii,seq) === false){return ii + 1;}}return ii;}return seq.__iterateUncached(fn,reverse);}function seqIterator(seq,type,reverse,useKeys){var cache=seq._cache;if(cache){var maxIndex=cache.length - 1;var ii=0;return new Iterator(function(){var entry=cache[reverse?maxIndex - ii:ii];return ii++ > maxIndex?iteratorDone():iteratorValue(type,useKeys?entry[0]:ii - 1,entry[1]);});}return seq.__iteratorUncached(type,reverse);}function fromJS(json,converter){return converter?fromJSWith(converter,json,'',{'':json}):fromJSDefault(json);}function fromJSWith(converter,json,key,parentJSON){if(Array.isArray(json)){return converter.call(parentJSON,key,IndexedSeq(json).map(function(v,k){return fromJSWith(converter,v,k,json);}));}if(isPlainObj(json)){return converter.call(parentJSON,key,KeyedSeq(json).map(function(v,k){return fromJSWith(converter,v,k,json);}));}return json;}function fromJSDefault(json){if(Array.isArray(json)){return IndexedSeq(json).map(fromJSDefault).toList();}if(isPlainObj(json)){return KeyedSeq(json).map(fromJSDefault).toMap();}return json;}function isPlainObj(value){return value && (value.constructor === Object || value.constructor === undefined);} /**
	   * An extension of the "same-value" algorithm as [described for use by ES6 Map
	   * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
	   *
	   * NaN is considered the same as NaN, however -0 and 0 are considered the same
	   * value, which is different from the algorithm described by
	   * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
	   *
	   * This is extended further to allow Objects to describe the values they
	   * represent, by way of `valueOf` or `equals` (and `hashCode`).
	   *
	   * Note: because of this extension, the key equality of Immutable.Map and the
	   * value equality of Immutable.Set will differ from ES6 Map and Set.
	   *
	   * ### Defining custom values
	   *
	   * The easiest way to describe the value an object represents is by implementing
	   * `valueOf`. For example, `Date` represents a value by returning a unix
	   * timestamp for `valueOf`:
	   *
	   *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
	   *     var date2 = new Date(1234567890000);
	   *     date1.valueOf(); // 1234567890000
	   *     assert( date1 !== date2 );
	   *     assert( Immutable.is( date1, date2 ) );
	   *
	   * Note: overriding `valueOf` may have other implications if you use this object
	   * where JavaScript expects a primitive, such as implicit string coercion.
	   *
	   * For more complex types, especially collections, implementing `valueOf` may
	   * not be performant. An alternative is to implement `equals` and `hashCode`.
	   *
	   * `equals` takes another object, presumably of similar type, and returns true
	   * if the it is equal. Equality is symmetrical, so the same result should be
	   * returned if this and the argument are flipped.
	   *
	   *     assert( a.equals(b) === b.equals(a) );
	   *
	   * `hashCode` returns a 32bit integer number representing the object which will
	   * be used to determine how to store the value object in a Map or Set. You must
	   * provide both or neither methods, one must not exist without the other.
	   *
	   * Also, an important relationship between these methods must be upheld: if two
	   * values are equal, they *must* return the same hashCode. If the values are not
	   * equal, they might have the same hashCode; this is called a hash collision,
	   * and while undesirable for performance reasons, it is acceptable.
	   *
	   *     if (a.equals(b)) {
	   *       assert( a.hashCode() === b.hashCode() );
	   *     }
	   *
	   * All Immutable collections implement `equals` and `hashCode`.
	   *
	   */function is(valueA,valueB){if(valueA === valueB || valueA !== valueA && valueB !== valueB){return true;}if(!valueA || !valueB){return false;}if(typeof valueA.valueOf === 'function' && typeof valueB.valueOf === 'function'){valueA = valueA.valueOf();valueB = valueB.valueOf();if(valueA === valueB || valueA !== valueA && valueB !== valueB){return true;}if(!valueA || !valueB){return false;}}if(typeof valueA.equals === 'function' && typeof valueB.equals === 'function' && valueA.equals(valueB)){return true;}return false;}function deepEqual(a,b){if(a === b){return true;}if(!isIterable(b) || a.size !== undefined && b.size !== undefined && a.size !== b.size || a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash || isKeyed(a) !== isKeyed(b) || isIndexed(a) !== isIndexed(b) || isOrdered(a) !== isOrdered(b)){return false;}if(a.size === 0 && b.size === 0){return true;}var notAssociative=!isAssociative(a);if(isOrdered(a)){var entries=a.entries();return b.every(function(v,k){var entry=entries.next().value;return entry && is(entry[1],v) && (notAssociative || is(entry[0],k));}) && entries.next().done;}var flipped=false;if(a.size === undefined){if(b.size === undefined){if(typeof a.cacheResult === 'function'){a.cacheResult();}}else {flipped = true;var _=a;a = b;b = _;}}var allEqual=true;var bSize=b.__iterate(function(v,k){if(notAssociative?!a.has(v):flipped?!is(v,a.get(k,NOT_SET)):!is(a.get(k,NOT_SET),v)){allEqual = false;return false;}});return allEqual && a.size === bSize;}createClass(Repeat,IndexedSeq);function Repeat(value,times){if(!(this instanceof Repeat)){return new Repeat(value,times);}this._value = value;this.size = times === undefined?Infinity:Math.max(0,times);if(this.size === 0){if(EMPTY_REPEAT){return EMPTY_REPEAT;}EMPTY_REPEAT = this;}}Repeat.prototype.toString = function(){if(this.size === 0){return 'Repeat []';}return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';};Repeat.prototype.get = function(index,notSetValue){return this.has(index)?this._value:notSetValue;};Repeat.prototype.includes = function(searchValue){return is(this._value,searchValue);};Repeat.prototype.slice = function(begin,end){var size=this.size;return wholeSlice(begin,end,size)?this:new Repeat(this._value,resolveEnd(end,size) - resolveBegin(begin,size));};Repeat.prototype.reverse = function(){return this;};Repeat.prototype.indexOf = function(searchValue){if(is(this._value,searchValue)){return 0;}return -1;};Repeat.prototype.lastIndexOf = function(searchValue){if(is(this._value,searchValue)){return this.size;}return -1;};Repeat.prototype.__iterate = function(fn,reverse){for(var ii=0;ii < this.size;ii++) {if(fn(this._value,ii,this) === false){return ii + 1;}}return ii;};Repeat.prototype.__iterator = function(type,reverse){var this$0=this;var ii=0;return new Iterator(function(){return ii < this$0.size?iteratorValue(type,ii++,this$0._value):iteratorDone();});};Repeat.prototype.equals = function(other){return other instanceof Repeat?is(this._value,other._value):deepEqual(other);};var EMPTY_REPEAT;function invariant(condition,error){if(!condition)throw new Error(error);}createClass(Range,IndexedSeq);function Range(start,end,step){if(!(this instanceof Range)){return new Range(start,end,step);}invariant(step !== 0,'Cannot step a Range by 0');start = start || 0;if(end === undefined){end = Infinity;}step = step === undefined?1:Math.abs(step);if(end < start){step = -step;}this._start = start;this._end = end;this._step = step;this.size = Math.max(0,Math.ceil((end - start) / step - 1) + 1);if(this.size === 0){if(EMPTY_RANGE){return EMPTY_RANGE;}EMPTY_RANGE = this;}}Range.prototype.toString = function(){if(this.size === 0){return 'Range []';}return 'Range [ ' + this._start + '...' + this._end + (this._step !== 1?' by ' + this._step:'') + ' ]';};Range.prototype.get = function(index,notSetValue){return this.has(index)?this._start + wrapIndex(this,index) * this._step:notSetValue;};Range.prototype.includes = function(searchValue){var possibleIndex=(searchValue - this._start) / this._step;return possibleIndex >= 0 && possibleIndex < this.size && possibleIndex === Math.floor(possibleIndex);};Range.prototype.slice = function(begin,end){if(wholeSlice(begin,end,this.size)){return this;}begin = resolveBegin(begin,this.size);end = resolveEnd(end,this.size);if(end <= begin){return new Range(0,0);}return new Range(this.get(begin,this._end),this.get(end,this._end),this._step);};Range.prototype.indexOf = function(searchValue){var offsetValue=searchValue - this._start;if(offsetValue % this._step === 0){var index=offsetValue / this._step;if(index >= 0 && index < this.size){return index;}}return -1;};Range.prototype.lastIndexOf = function(searchValue){return this.indexOf(searchValue);};Range.prototype.__iterate = function(fn,reverse){var maxIndex=this.size - 1;var step=this._step;var value=reverse?this._start + maxIndex * step:this._start;for(var ii=0;ii <= maxIndex;ii++) {if(fn(value,ii,this) === false){return ii + 1;}value += reverse?-step:step;}return ii;};Range.prototype.__iterator = function(type,reverse){var maxIndex=this.size - 1;var step=this._step;var value=reverse?this._start + maxIndex * step:this._start;var ii=0;return new Iterator(function(){var v=value;value += reverse?-step:step;return ii > maxIndex?iteratorDone():iteratorValue(type,ii++,v);});};Range.prototype.equals = function(other){return other instanceof Range?this._start === other._start && this._end === other._end && this._step === other._step:deepEqual(this,other);};var EMPTY_RANGE;createClass(Collection,Iterable);function Collection(){throw TypeError('Abstract');}createClass(KeyedCollection,Collection);function KeyedCollection(){}createClass(IndexedCollection,Collection);function IndexedCollection(){}createClass(SetCollection,Collection);function SetCollection(){}Collection.Keyed = KeyedCollection;Collection.Indexed = IndexedCollection;Collection.Set = SetCollection;var imul=typeof Math.imul === 'function' && Math.imul(0xffffffff,2) === -2?Math.imul:function imul(a,b){a = a | 0; // int
	b = b | 0; // int
	var c=a & 0xffff;var d=b & 0xffff; // Shift by 0 fixes the sign on the high part.
	return c * d + ((a >>> 16) * d + c * (b >>> 16) << 16 >>> 0) | 0; // int
	}; // v8 has an optimization for storing 31-bit signed numbers.
	// Values which have either 00 or 11 as the high order bits qualify.
	// This function drops the highest order bit in a signed number, maintaining
	// the sign bit.
	function smi(i32){return i32 >>> 1 & 0x40000000 | i32 & 0xBFFFFFFF;}function hash(o){if(o === false || o === null || o === undefined){return 0;}if(typeof o.valueOf === 'function'){o = o.valueOf();if(o === false || o === null || o === undefined){return 0;}}if(o === true){return 1;}var type=typeof o;if(type === 'number'){if(o !== o || o === Infinity){return 0;}var h=o | 0;if(h !== o){h ^= o * 0xFFFFFFFF;}while(o > 0xFFFFFFFF) {o /= 0xFFFFFFFF;h ^= o;}return smi(h);}if(type === 'string'){return o.length > STRING_HASH_CACHE_MIN_STRLEN?cachedHashString(o):hashString(o);}if(typeof o.hashCode === 'function'){return o.hashCode();}if(type === 'object'){return hashJSObj(o);}if(typeof o.toString === 'function'){return hashString(o.toString());}throw new Error('Value type ' + type + ' cannot be hashed.');}function cachedHashString(string){var hash=stringHashCache[string];if(hash === undefined){hash = hashString(string);if(STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE){STRING_HASH_CACHE_SIZE = 0;stringHashCache = {};}STRING_HASH_CACHE_SIZE++;stringHashCache[string] = hash;}return hash;} // http://jsperf.com/hashing-strings
	function hashString(string){ // This is the hash from JVM
	// The hash code for a string is computed as
	// s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
	// where s[i] is the ith character of the string and n is the length of
	// the string. We "mod" the result to make it between 0 (inclusive) and 2^31
	// (exclusive) by dropping high bits.
	var hash=0;for(var ii=0;ii < string.length;ii++) {hash = 31 * hash + string.charCodeAt(ii) | 0;}return smi(hash);}function hashJSObj(obj){var hash;if(usingWeakMap){hash = weakMap.get(obj);if(hash !== undefined){return hash;}}hash = obj[UID_HASH_KEY];if(hash !== undefined){return hash;}if(!canDefineProperty){hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];if(hash !== undefined){return hash;}hash = getIENodeHash(obj);if(hash !== undefined){return hash;}}hash = ++objHashUID;if(objHashUID & 0x40000000){objHashUID = 0;}if(usingWeakMap){weakMap.set(obj,hash);}else if(isExtensible !== undefined && isExtensible(obj) === false){throw new Error('Non-extensible objects are not allowed as keys.');}else if(canDefineProperty){Object.defineProperty(obj,UID_HASH_KEY,{'enumerable':false,'configurable':false,'writable':false,'value':hash});}else if(obj.propertyIsEnumerable !== undefined && obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable){ // Since we can't define a non-enumerable property on the object
	// we'll hijack one of the less-used non-enumerable properties to
	// save our hash on it. Since this is a function it will not show up in
	// `JSON.stringify` which is what we want.
	obj.propertyIsEnumerable = function(){return this.constructor.prototype.propertyIsEnumerable.apply(this,arguments);};obj.propertyIsEnumerable[UID_HASH_KEY] = hash;}else if(obj.nodeType !== undefined){ // At this point we couldn't get the IE `uniqueID` to use as a hash
	// and we couldn't use a non-enumerable property to exploit the
	// dontEnum bug so we simply add the `UID_HASH_KEY` on the node
	// itself.
	obj[UID_HASH_KEY] = hash;}else {throw new Error('Unable to set a non-enumerable property on object.');}return hash;} // Get references to ES5 object methods.
	var isExtensible=Object.isExtensible; // True if Object.defineProperty works as expected. IE8 fails this test.
	var canDefineProperty=(function(){try{Object.defineProperty({},'@',{});return true;}catch(e) {return false;}})(); // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
	// and avoid memory leaks from the IE cloneNode bug.
	function getIENodeHash(node){if(node && node.nodeType > 0){switch(node.nodeType){case 1: // Element
	return node.uniqueID;case 9: // Document
	return node.documentElement && node.documentElement.uniqueID;}}} // If possible, use a WeakMap.
	var usingWeakMap=typeof WeakMap === 'function';var weakMap;if(usingWeakMap){weakMap = new WeakMap();}var objHashUID=0;var UID_HASH_KEY='__immutablehash__';if(typeof Symbol === 'function'){UID_HASH_KEY = Symbol(UID_HASH_KEY);}var STRING_HASH_CACHE_MIN_STRLEN=16;var STRING_HASH_CACHE_MAX_SIZE=255;var STRING_HASH_CACHE_SIZE=0;var stringHashCache={};function assertNotInfinite(size){invariant(size !== Infinity,'Cannot perform this action with an infinite size.');}createClass(Map,KeyedCollection); // @pragma Construction
	function Map(value){return value === null || value === undefined?emptyMap():isMap(value) && !isOrdered(value)?value:emptyMap().withMutations(function(map){var iter=KeyedIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v,k){return map.set(k,v);});});}Map.of = function(){var keyValues=SLICE$0.call(arguments,0);return emptyMap().withMutations(function(map){for(var i=0;i < keyValues.length;i += 2) {if(i + 1 >= keyValues.length){throw new Error('Missing value for key: ' + keyValues[i]);}map.set(keyValues[i],keyValues[i + 1]);}});};Map.prototype.toString = function(){return this.__toString('Map {','}');}; // @pragma Access
	Map.prototype.get = function(k,notSetValue){return this._root?this._root.get(0,undefined,k,notSetValue):notSetValue;}; // @pragma Modification
	Map.prototype.set = function(k,v){return updateMap(this,k,v);};Map.prototype.setIn = function(keyPath,v){return this.updateIn(keyPath,NOT_SET,function(){return v;});};Map.prototype.remove = function(k){return updateMap(this,k,NOT_SET);};Map.prototype.deleteIn = function(keyPath){return this.updateIn(keyPath,function(){return NOT_SET;});};Map.prototype.update = function(k,notSetValue,updater){return arguments.length === 1?k(this):this.updateIn([k],notSetValue,updater);};Map.prototype.updateIn = function(keyPath,notSetValue,updater){if(!updater){updater = notSetValue;notSetValue = undefined;}var updatedValue=updateInDeepMap(this,forceIterator(keyPath),notSetValue,updater);return updatedValue === NOT_SET?undefined:updatedValue;};Map.prototype.clear = function(){if(this.size === 0){return this;}if(this.__ownerID){this.size = 0;this._root = null;this.__hash = undefined;this.__altered = true;return this;}return emptyMap();}; // @pragma Composition
	Map.prototype.merge = function() /*...iters*/{return mergeIntoMapWith(this,undefined,arguments);};Map.prototype.mergeWith = function(merger){var iters=SLICE$0.call(arguments,1);return mergeIntoMapWith(this,merger,iters);};Map.prototype.mergeIn = function(keyPath){var iters=SLICE$0.call(arguments,1);return this.updateIn(keyPath,emptyMap(),function(m){return typeof m.merge === 'function'?m.merge.apply(m,iters):iters[iters.length - 1];});};Map.prototype.mergeDeep = function() /*...iters*/{return mergeIntoMapWith(this,deepMerger,arguments);};Map.prototype.mergeDeepWith = function(merger){var iters=SLICE$0.call(arguments,1);return mergeIntoMapWith(this,deepMergerWith(merger),iters);};Map.prototype.mergeDeepIn = function(keyPath){var iters=SLICE$0.call(arguments,1);return this.updateIn(keyPath,emptyMap(),function(m){return typeof m.mergeDeep === 'function'?m.mergeDeep.apply(m,iters):iters[iters.length - 1];});};Map.prototype.sort = function(comparator){ // Late binding
	return OrderedMap(sortFactory(this,comparator));};Map.prototype.sortBy = function(mapper,comparator){ // Late binding
	return OrderedMap(sortFactory(this,comparator,mapper));}; // @pragma Mutability
	Map.prototype.withMutations = function(fn){var mutable=this.asMutable();fn(mutable);return mutable.wasAltered()?mutable.__ensureOwner(this.__ownerID):this;};Map.prototype.asMutable = function(){return this.__ownerID?this:this.__ensureOwner(new OwnerID());};Map.prototype.asImmutable = function(){return this.__ensureOwner();};Map.prototype.wasAltered = function(){return this.__altered;};Map.prototype.__iterator = function(type,reverse){return new MapIterator(this,type,reverse);};Map.prototype.__iterate = function(fn,reverse){var this$0=this;var iterations=0;this._root && this._root.iterate(function(entry){iterations++;return fn(entry[1],entry[0],this$0);},reverse);return iterations;};Map.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}if(!ownerID){this.__ownerID = ownerID;this.__altered = false;return this;}return makeMap(this.size,this._root,ownerID,this.__hash);};function isMap(maybeMap){return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);}Map.isMap = isMap;var IS_MAP_SENTINEL='@@__IMMUTABLE_MAP__@@';var MapPrototype=Map.prototype;MapPrototype[IS_MAP_SENTINEL] = true;MapPrototype[DELETE] = MapPrototype.remove;MapPrototype.removeIn = MapPrototype.deleteIn; // #pragma Trie Nodes
	function ArrayMapNode(ownerID,entries){this.ownerID = ownerID;this.entries = entries;}ArrayMapNode.prototype.get = function(shift,keyHash,key,notSetValue){var entries=this.entries;for(var ii=0,len=entries.length;ii < len;ii++) {if(is(key,entries[ii][0])){return entries[ii][1];}}return notSetValue;};ArrayMapNode.prototype.update = function(ownerID,shift,keyHash,key,value,didChangeSize,didAlter){var removed=value === NOT_SET;var entries=this.entries;var idx=0;for(var len=entries.length;idx < len;idx++) {if(is(key,entries[idx][0])){break;}}var exists=idx < len;if(exists?entries[idx][1] === value:removed){return this;}SetRef(didAlter);(removed || !exists) && SetRef(didChangeSize);if(removed && entries.length === 1){return; // undefined
	}if(!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE){return createNodes(ownerID,entries,key,value);}var isEditable=ownerID && ownerID === this.ownerID;var newEntries=isEditable?entries:arrCopy(entries);if(exists){if(removed){idx === len - 1?newEntries.pop():newEntries[idx] = newEntries.pop();}else {newEntries[idx] = [key,value];}}else {newEntries.push([key,value]);}if(isEditable){this.entries = newEntries;return this;}return new ArrayMapNode(ownerID,newEntries);};function BitmapIndexedNode(ownerID,bitmap,nodes){this.ownerID = ownerID;this.bitmap = bitmap;this.nodes = nodes;}BitmapIndexedNode.prototype.get = function(shift,keyHash,key,notSetValue){if(keyHash === undefined){keyHash = hash(key);}var bit=1 << ((shift === 0?keyHash:keyHash >>> shift) & MASK);var bitmap=this.bitmap;return (bitmap & bit) === 0?notSetValue:this.nodes[popCount(bitmap & bit - 1)].get(shift + SHIFT,keyHash,key,notSetValue);};BitmapIndexedNode.prototype.update = function(ownerID,shift,keyHash,key,value,didChangeSize,didAlter){if(keyHash === undefined){keyHash = hash(key);}var keyHashFrag=(shift === 0?keyHash:keyHash >>> shift) & MASK;var bit=1 << keyHashFrag;var bitmap=this.bitmap;var exists=(bitmap & bit) !== 0;if(!exists && value === NOT_SET){return this;}var idx=popCount(bitmap & bit - 1);var nodes=this.nodes;var node=exists?nodes[idx]:undefined;var newNode=updateNode(node,ownerID,shift + SHIFT,keyHash,key,value,didChangeSize,didAlter);if(newNode === node){return this;}if(!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE){return expandNodes(ownerID,nodes,bitmap,keyHashFrag,newNode);}if(exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])){return nodes[idx ^ 1];}if(exists && newNode && nodes.length === 1 && isLeafNode(newNode)){return newNode;}var isEditable=ownerID && ownerID === this.ownerID;var newBitmap=exists?newNode?bitmap:bitmap ^ bit:bitmap | bit;var newNodes=exists?newNode?setIn(nodes,idx,newNode,isEditable):spliceOut(nodes,idx,isEditable):spliceIn(nodes,idx,newNode,isEditable);if(isEditable){this.bitmap = newBitmap;this.nodes = newNodes;return this;}return new BitmapIndexedNode(ownerID,newBitmap,newNodes);};function HashArrayMapNode(ownerID,count,nodes){this.ownerID = ownerID;this.count = count;this.nodes = nodes;}HashArrayMapNode.prototype.get = function(shift,keyHash,key,notSetValue){if(keyHash === undefined){keyHash = hash(key);}var idx=(shift === 0?keyHash:keyHash >>> shift) & MASK;var node=this.nodes[idx];return node?node.get(shift + SHIFT,keyHash,key,notSetValue):notSetValue;};HashArrayMapNode.prototype.update = function(ownerID,shift,keyHash,key,value,didChangeSize,didAlter){if(keyHash === undefined){keyHash = hash(key);}var idx=(shift === 0?keyHash:keyHash >>> shift) & MASK;var removed=value === NOT_SET;var nodes=this.nodes;var node=nodes[idx];if(removed && !node){return this;}var newNode=updateNode(node,ownerID,shift + SHIFT,keyHash,key,value,didChangeSize,didAlter);if(newNode === node){return this;}var newCount=this.count;if(!node){newCount++;}else if(!newNode){newCount--;if(newCount < MIN_HASH_ARRAY_MAP_SIZE){return packNodes(ownerID,nodes,newCount,idx);}}var isEditable=ownerID && ownerID === this.ownerID;var newNodes=setIn(nodes,idx,newNode,isEditable);if(isEditable){this.count = newCount;this.nodes = newNodes;return this;}return new HashArrayMapNode(ownerID,newCount,newNodes);};function HashCollisionNode(ownerID,keyHash,entries){this.ownerID = ownerID;this.keyHash = keyHash;this.entries = entries;}HashCollisionNode.prototype.get = function(shift,keyHash,key,notSetValue){var entries=this.entries;for(var ii=0,len=entries.length;ii < len;ii++) {if(is(key,entries[ii][0])){return entries[ii][1];}}return notSetValue;};HashCollisionNode.prototype.update = function(ownerID,shift,keyHash,key,value,didChangeSize,didAlter){if(keyHash === undefined){keyHash = hash(key);}var removed=value === NOT_SET;if(keyHash !== this.keyHash){if(removed){return this;}SetRef(didAlter);SetRef(didChangeSize);return mergeIntoNode(this,ownerID,shift,keyHash,[key,value]);}var entries=this.entries;var idx=0;for(var len=entries.length;idx < len;idx++) {if(is(key,entries[idx][0])){break;}}var exists=idx < len;if(exists?entries[idx][1] === value:removed){return this;}SetRef(didAlter);(removed || !exists) && SetRef(didChangeSize);if(removed && len === 2){return new ValueNode(ownerID,this.keyHash,entries[idx ^ 1]);}var isEditable=ownerID && ownerID === this.ownerID;var newEntries=isEditable?entries:arrCopy(entries);if(exists){if(removed){idx === len - 1?newEntries.pop():newEntries[idx] = newEntries.pop();}else {newEntries[idx] = [key,value];}}else {newEntries.push([key,value]);}if(isEditable){this.entries = newEntries;return this;}return new HashCollisionNode(ownerID,this.keyHash,newEntries);};function ValueNode(ownerID,keyHash,entry){this.ownerID = ownerID;this.keyHash = keyHash;this.entry = entry;}ValueNode.prototype.get = function(shift,keyHash,key,notSetValue){return is(key,this.entry[0])?this.entry[1]:notSetValue;};ValueNode.prototype.update = function(ownerID,shift,keyHash,key,value,didChangeSize,didAlter){var removed=value === NOT_SET;var keyMatch=is(key,this.entry[0]);if(keyMatch?value === this.entry[1]:removed){return this;}SetRef(didAlter);if(removed){SetRef(didChangeSize);return; // undefined
	}if(keyMatch){if(ownerID && ownerID === this.ownerID){this.entry[1] = value;return this;}return new ValueNode(ownerID,this.keyHash,[key,value]);}SetRef(didChangeSize);return mergeIntoNode(this,ownerID,shift,hash(key),[key,value]);}; // #pragma Iterators
	ArrayMapNode.prototype.iterate = HashCollisionNode.prototype.iterate = function(fn,reverse){var entries=this.entries;for(var ii=0,maxIndex=entries.length - 1;ii <= maxIndex;ii++) {if(fn(entries[reverse?maxIndex - ii:ii]) === false){return false;}}};BitmapIndexedNode.prototype.iterate = HashArrayMapNode.prototype.iterate = function(fn,reverse){var nodes=this.nodes;for(var ii=0,maxIndex=nodes.length - 1;ii <= maxIndex;ii++) {var node=nodes[reverse?maxIndex - ii:ii];if(node && node.iterate(fn,reverse) === false){return false;}}};ValueNode.prototype.iterate = function(fn,reverse){return fn(this.entry);};createClass(MapIterator,Iterator);function MapIterator(map,type,reverse){this._type = type;this._reverse = reverse;this._stack = map._root && mapIteratorFrame(map._root);}MapIterator.prototype.next = function(){var type=this._type;var stack=this._stack;while(stack) {var node=stack.node;var index=stack.index++;var maxIndex;if(node.entry){if(index === 0){return mapIteratorValue(type,node.entry);}}else if(node.entries){maxIndex = node.entries.length - 1;if(index <= maxIndex){return mapIteratorValue(type,node.entries[this._reverse?maxIndex - index:index]);}}else {maxIndex = node.nodes.length - 1;if(index <= maxIndex){var subNode=node.nodes[this._reverse?maxIndex - index:index];if(subNode){if(subNode.entry){return mapIteratorValue(type,subNode.entry);}stack = this._stack = mapIteratorFrame(subNode,stack);}continue;}}stack = this._stack = this._stack.__prev;}return iteratorDone();};function mapIteratorValue(type,entry){return iteratorValue(type,entry[0],entry[1]);}function mapIteratorFrame(node,prev){return {node:node,index:0,__prev:prev};}function makeMap(size,root,ownerID,hash){var map=Object.create(MapPrototype);map.size = size;map._root = root;map.__ownerID = ownerID;map.__hash = hash;map.__altered = false;return map;}var EMPTY_MAP;function emptyMap(){return EMPTY_MAP || (EMPTY_MAP = makeMap(0));}function updateMap(map,k,v){var newRoot;var newSize;if(!map._root){if(v === NOT_SET){return map;}newSize = 1;newRoot = new ArrayMapNode(map.__ownerID,[[k,v]]);}else {var didChangeSize=MakeRef(CHANGE_LENGTH);var didAlter=MakeRef(DID_ALTER);newRoot = updateNode(map._root,map.__ownerID,0,undefined,k,v,didChangeSize,didAlter);if(!didAlter.value){return map;}newSize = map.size + (didChangeSize.value?v === NOT_SET?-1:1:0);}if(map.__ownerID){map.size = newSize;map._root = newRoot;map.__hash = undefined;map.__altered = true;return map;}return newRoot?makeMap(newSize,newRoot):emptyMap();}function updateNode(node,ownerID,shift,keyHash,key,value,didChangeSize,didAlter){if(!node){if(value === NOT_SET){return node;}SetRef(didAlter);SetRef(didChangeSize);return new ValueNode(ownerID,keyHash,[key,value]);}return node.update(ownerID,shift,keyHash,key,value,didChangeSize,didAlter);}function isLeafNode(node){return node.constructor === ValueNode || node.constructor === HashCollisionNode;}function mergeIntoNode(node,ownerID,shift,keyHash,entry){if(node.keyHash === keyHash){return new HashCollisionNode(ownerID,keyHash,[node.entry,entry]);}var idx1=(shift === 0?node.keyHash:node.keyHash >>> shift) & MASK;var idx2=(shift === 0?keyHash:keyHash >>> shift) & MASK;var newNode;var nodes=idx1 === idx2?[mergeIntoNode(node,ownerID,shift + SHIFT,keyHash,entry)]:(newNode = new ValueNode(ownerID,keyHash,entry),idx1 < idx2?[node,newNode]:[newNode,node]);return new BitmapIndexedNode(ownerID,1 << idx1 | 1 << idx2,nodes);}function createNodes(ownerID,entries,key,value){if(!ownerID){ownerID = new OwnerID();}var node=new ValueNode(ownerID,hash(key),[key,value]);for(var ii=0;ii < entries.length;ii++) {var entry=entries[ii];node = node.update(ownerID,0,undefined,entry[0],entry[1]);}return node;}function packNodes(ownerID,nodes,count,excluding){var bitmap=0;var packedII=0;var packedNodes=new Array(count);for(var ii=0,bit=1,len=nodes.length;ii < len;ii++,bit <<= 1) {var node=nodes[ii];if(node !== undefined && ii !== excluding){bitmap |= bit;packedNodes[packedII++] = node;}}return new BitmapIndexedNode(ownerID,bitmap,packedNodes);}function expandNodes(ownerID,nodes,bitmap,including,node){var count=0;var expandedNodes=new Array(SIZE);for(var ii=0;bitmap !== 0;ii++,bitmap >>>= 1) {expandedNodes[ii] = bitmap & 1?nodes[count++]:undefined;}expandedNodes[including] = node;return new HashArrayMapNode(ownerID,count + 1,expandedNodes);}function mergeIntoMapWith(map,merger,iterables){var iters=[];for(var ii=0;ii < iterables.length;ii++) {var value=iterables[ii];var iter=KeyedIterable(value);if(!isIterable(value)){iter = iter.map(function(v){return fromJS(v);});}iters.push(iter);}return mergeIntoCollectionWith(map,merger,iters);}function deepMerger(existing,value,key){return existing && existing.mergeDeep && isIterable(value)?existing.mergeDeep(value):is(existing,value)?existing:value;}function deepMergerWith(merger){return function(existing,value,key){if(existing && existing.mergeDeepWith && isIterable(value)){return existing.mergeDeepWith(merger,value);}var nextValue=merger(existing,value,key);return is(existing,nextValue)?existing:nextValue;};}function mergeIntoCollectionWith(collection,merger,iters){iters = iters.filter(function(x){return x.size !== 0;});if(iters.length === 0){return collection;}if(collection.size === 0 && !collection.__ownerID && iters.length === 1){return collection.constructor(iters[0]);}return collection.withMutations(function(collection){var mergeIntoMap=merger?function(value,key){collection.update(key,NOT_SET,function(existing){return existing === NOT_SET?value:merger(existing,value,key);});}:function(value,key){collection.set(key,value);};for(var ii=0;ii < iters.length;ii++) {iters[ii].forEach(mergeIntoMap);}});}function updateInDeepMap(existing,keyPathIter,notSetValue,updater){var isNotSet=existing === NOT_SET;var step=keyPathIter.next();if(step.done){var existingValue=isNotSet?notSetValue:existing;var newValue=updater(existingValue);return newValue === existingValue?existing:newValue;}invariant(isNotSet || existing && existing.set,'invalid keyPath');var key=step.value;var nextExisting=isNotSet?NOT_SET:existing.get(key,NOT_SET);var nextUpdated=updateInDeepMap(nextExisting,keyPathIter,notSetValue,updater);return nextUpdated === nextExisting?existing:nextUpdated === NOT_SET?existing.remove(key):(isNotSet?emptyMap():existing).set(key,nextUpdated);}function popCount(x){x = x - (x >> 1 & 0x55555555);x = (x & 0x33333333) + (x >> 2 & 0x33333333);x = x + (x >> 4) & 0x0f0f0f0f;x = x + (x >> 8);x = x + (x >> 16);return x & 0x7f;}function setIn(array,idx,val,canEdit){var newArray=canEdit?array:arrCopy(array);newArray[idx] = val;return newArray;}function spliceIn(array,idx,val,canEdit){var newLen=array.length + 1;if(canEdit && idx + 1 === newLen){array[idx] = val;return array;}var newArray=new Array(newLen);var after=0;for(var ii=0;ii < newLen;ii++) {if(ii === idx){newArray[ii] = val;after = -1;}else {newArray[ii] = array[ii + after];}}return newArray;}function spliceOut(array,idx,canEdit){var newLen=array.length - 1;if(canEdit && idx === newLen){array.pop();return array;}var newArray=new Array(newLen);var after=0;for(var ii=0;ii < newLen;ii++) {if(ii === idx){after = 1;}newArray[ii] = array[ii + after];}return newArray;}var MAX_ARRAY_MAP_SIZE=SIZE / 4;var MAX_BITMAP_INDEXED_SIZE=SIZE / 2;var MIN_HASH_ARRAY_MAP_SIZE=SIZE / 4;createClass(List,IndexedCollection); // @pragma Construction
	function List(value){var empty=emptyList();if(value === null || value === undefined){return empty;}if(isList(value)){return value;}var iter=IndexedIterable(value);var size=iter.size;if(size === 0){return empty;}assertNotInfinite(size);if(size > 0 && size < SIZE){return makeList(0,size,SHIFT,null,new VNode(iter.toArray()));}return empty.withMutations(function(list){list.setSize(size);iter.forEach(function(v,i){return list.set(i,v);});});}List.of = function() /*...values*/{return this(arguments);};List.prototype.toString = function(){return this.__toString('List [',']');}; // @pragma Access
	List.prototype.get = function(index,notSetValue){index = wrapIndex(this,index);if(index >= 0 && index < this.size){index += this._origin;var node=listNodeFor(this,index);return node && node.array[index & MASK];}return notSetValue;}; // @pragma Modification
	List.prototype.set = function(index,value){return updateList(this,index,value);};List.prototype.remove = function(index){return !this.has(index)?this:index === 0?this.shift():index === this.size - 1?this.pop():this.splice(index,1);};List.prototype.insert = function(index,value){return this.splice(index,0,value);};List.prototype.clear = function(){if(this.size === 0){return this;}if(this.__ownerID){this.size = this._origin = this._capacity = 0;this._level = SHIFT;this._root = this._tail = null;this.__hash = undefined;this.__altered = true;return this;}return emptyList();};List.prototype.push = function() /*...values*/{var values=arguments;var oldSize=this.size;return this.withMutations(function(list){setListBounds(list,0,oldSize + values.length);for(var ii=0;ii < values.length;ii++) {list.set(oldSize + ii,values[ii]);}});};List.prototype.pop = function(){return setListBounds(this,0,-1);};List.prototype.unshift = function() /*...values*/{var values=arguments;return this.withMutations(function(list){setListBounds(list,-values.length);for(var ii=0;ii < values.length;ii++) {list.set(ii,values[ii]);}});};List.prototype.shift = function(){return setListBounds(this,1);}; // @pragma Composition
	List.prototype.merge = function() /*...iters*/{return mergeIntoListWith(this,undefined,arguments);};List.prototype.mergeWith = function(merger){var iters=SLICE$0.call(arguments,1);return mergeIntoListWith(this,merger,iters);};List.prototype.mergeDeep = function() /*...iters*/{return mergeIntoListWith(this,deepMerger,arguments);};List.prototype.mergeDeepWith = function(merger){var iters=SLICE$0.call(arguments,1);return mergeIntoListWith(this,deepMergerWith(merger),iters);};List.prototype.setSize = function(size){return setListBounds(this,0,size);}; // @pragma Iteration
	List.prototype.slice = function(begin,end){var size=this.size;if(wholeSlice(begin,end,size)){return this;}return setListBounds(this,resolveBegin(begin,size),resolveEnd(end,size));};List.prototype.__iterator = function(type,reverse){var index=0;var values=iterateList(this,reverse);return new Iterator(function(){var value=values();return value === DONE?iteratorDone():iteratorValue(type,index++,value);});};List.prototype.__iterate = function(fn,reverse){var index=0;var values=iterateList(this,reverse);var value;while((value = values()) !== DONE) {if(fn(value,index++,this) === false){break;}}return index;};List.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}if(!ownerID){this.__ownerID = ownerID;return this;}return makeList(this._origin,this._capacity,this._level,this._root,this._tail,ownerID,this.__hash);};function isList(maybeList){return !!(maybeList && maybeList[IS_LIST_SENTINEL]);}List.isList = isList;var IS_LIST_SENTINEL='@@__IMMUTABLE_LIST__@@';var ListPrototype=List.prototype;ListPrototype[IS_LIST_SENTINEL] = true;ListPrototype[DELETE] = ListPrototype.remove;ListPrototype.setIn = MapPrototype.setIn;ListPrototype.deleteIn = ListPrototype.removeIn = MapPrototype.removeIn;ListPrototype.update = MapPrototype.update;ListPrototype.updateIn = MapPrototype.updateIn;ListPrototype.mergeIn = MapPrototype.mergeIn;ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;ListPrototype.withMutations = MapPrototype.withMutations;ListPrototype.asMutable = MapPrototype.asMutable;ListPrototype.asImmutable = MapPrototype.asImmutable;ListPrototype.wasAltered = MapPrototype.wasAltered;function VNode(array,ownerID){this.array = array;this.ownerID = ownerID;} // TODO: seems like these methods are very similar
	VNode.prototype.removeBefore = function(ownerID,level,index){if(index === level?1 << level:0 || this.array.length === 0){return this;}var originIndex=index >>> level & MASK;if(originIndex >= this.array.length){return new VNode([],ownerID);}var removingFirst=originIndex === 0;var newChild;if(level > 0){var oldChild=this.array[originIndex];newChild = oldChild && oldChild.removeBefore(ownerID,level - SHIFT,index);if(newChild === oldChild && removingFirst){return this;}}if(removingFirst && !newChild){return this;}var editable=editableVNode(this,ownerID);if(!removingFirst){for(var ii=0;ii < originIndex;ii++) {editable.array[ii] = undefined;}}if(newChild){editable.array[originIndex] = newChild;}return editable;};VNode.prototype.removeAfter = function(ownerID,level,index){if(index === (level?1 << level:0) || this.array.length === 0){return this;}var sizeIndex=index - 1 >>> level & MASK;if(sizeIndex >= this.array.length){return this;}var newChild;if(level > 0){var oldChild=this.array[sizeIndex];newChild = oldChild && oldChild.removeAfter(ownerID,level - SHIFT,index);if(newChild === oldChild && sizeIndex === this.array.length - 1){return this;}}var editable=editableVNode(this,ownerID);editable.array.splice(sizeIndex + 1);if(newChild){editable.array[sizeIndex] = newChild;}return editable;};var DONE={};function iterateList(list,reverse){var left=list._origin;var right=list._capacity;var tailPos=getTailOffset(right);var tail=list._tail;return iterateNodeOrLeaf(list._root,list._level,0);function iterateNodeOrLeaf(node,level,offset){return level === 0?iterateLeaf(node,offset):iterateNode(node,level,offset);}function iterateLeaf(node,offset){var array=offset === tailPos?tail && tail.array:node && node.array;var from=offset > left?0:left - offset;var to=right - offset;if(to > SIZE){to = SIZE;}return function(){if(from === to){return DONE;}var idx=reverse?--to:from++;return array && array[idx];};}function iterateNode(node,level,offset){var values;var array=node && node.array;var from=offset > left?0:left - offset >> level;var to=(right - offset >> level) + 1;if(to > SIZE){to = SIZE;}return function(){do {if(values){var value=values();if(value !== DONE){return value;}values = null;}if(from === to){return DONE;}var idx=reverse?--to:from++;values = iterateNodeOrLeaf(array && array[idx],level - SHIFT,offset + (idx << level));}while(true);};}}function makeList(origin,capacity,level,root,tail,ownerID,hash){var list=Object.create(ListPrototype);list.size = capacity - origin;list._origin = origin;list._capacity = capacity;list._level = level;list._root = root;list._tail = tail;list.__ownerID = ownerID;list.__hash = hash;list.__altered = false;return list;}var EMPTY_LIST;function emptyList(){return EMPTY_LIST || (EMPTY_LIST = makeList(0,0,SHIFT));}function updateList(list,index,value){index = wrapIndex(list,index);if(index !== index){return list;}if(index >= list.size || index < 0){return list.withMutations(function(list){index < 0?setListBounds(list,index).set(0,value):setListBounds(list,0,index + 1).set(index,value);});}index += list._origin;var newTail=list._tail;var newRoot=list._root;var didAlter=MakeRef(DID_ALTER);if(index >= getTailOffset(list._capacity)){newTail = updateVNode(newTail,list.__ownerID,0,index,value,didAlter);}else {newRoot = updateVNode(newRoot,list.__ownerID,list._level,index,value,didAlter);}if(!didAlter.value){return list;}if(list.__ownerID){list._root = newRoot;list._tail = newTail;list.__hash = undefined;list.__altered = true;return list;}return makeList(list._origin,list._capacity,list._level,newRoot,newTail);}function updateVNode(node,ownerID,level,index,value,didAlter){var idx=index >>> level & MASK;var nodeHas=node && idx < node.array.length;if(!nodeHas && value === undefined){return node;}var newNode;if(level > 0){var lowerNode=node && node.array[idx];var newLowerNode=updateVNode(lowerNode,ownerID,level - SHIFT,index,value,didAlter);if(newLowerNode === lowerNode){return node;}newNode = editableVNode(node,ownerID);newNode.array[idx] = newLowerNode;return newNode;}if(nodeHas && node.array[idx] === value){return node;}SetRef(didAlter);newNode = editableVNode(node,ownerID);if(value === undefined && idx === newNode.array.length - 1){newNode.array.pop();}else {newNode.array[idx] = value;}return newNode;}function editableVNode(node,ownerID){if(ownerID && node && ownerID === node.ownerID){return node;}return new VNode(node?node.array.slice():[],ownerID);}function listNodeFor(list,rawIndex){if(rawIndex >= getTailOffset(list._capacity)){return list._tail;}if(rawIndex < 1 << list._level + SHIFT){var node=list._root;var level=list._level;while(node && level > 0) {node = node.array[rawIndex >>> level & MASK];level -= SHIFT;}return node;}}function setListBounds(list,begin,end){ // Sanitize begin & end using this shorthand for ToInt32(argument)
	// http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
	if(begin !== undefined){begin = begin | 0;}if(end !== undefined){end = end | 0;}var owner=list.__ownerID || new OwnerID();var oldOrigin=list._origin;var oldCapacity=list._capacity;var newOrigin=oldOrigin + begin;var newCapacity=end === undefined?oldCapacity:end < 0?oldCapacity + end:oldOrigin + end;if(newOrigin === oldOrigin && newCapacity === oldCapacity){return list;} // If it's going to end after it starts, it's empty.
	if(newOrigin >= newCapacity){return list.clear();}var newLevel=list._level;var newRoot=list._root; // New origin might need creating a higher root.
	var offsetShift=0;while(newOrigin + offsetShift < 0) {newRoot = new VNode(newRoot && newRoot.array.length?[undefined,newRoot]:[],owner);newLevel += SHIFT;offsetShift += 1 << newLevel;}if(offsetShift){newOrigin += offsetShift;oldOrigin += offsetShift;newCapacity += offsetShift;oldCapacity += offsetShift;}var oldTailOffset=getTailOffset(oldCapacity);var newTailOffset=getTailOffset(newCapacity); // New size might need creating a higher root.
	while(newTailOffset >= 1 << newLevel + SHIFT) {newRoot = new VNode(newRoot && newRoot.array.length?[newRoot]:[],owner);newLevel += SHIFT;} // Locate or create the new tail.
	var oldTail=list._tail;var newTail=newTailOffset < oldTailOffset?listNodeFor(list,newCapacity - 1):newTailOffset > oldTailOffset?new VNode([],owner):oldTail; // Merge Tail into tree.
	if(oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length){newRoot = editableVNode(newRoot,owner);var node=newRoot;for(var level=newLevel;level > SHIFT;level -= SHIFT) {var idx=oldTailOffset >>> level & MASK;node = node.array[idx] = editableVNode(node.array[idx],owner);}node.array[oldTailOffset >>> SHIFT & MASK] = oldTail;} // If the size has been reduced, there's a chance the tail needs to be trimmed.
	if(newCapacity < oldCapacity){newTail = newTail && newTail.removeAfter(owner,0,newCapacity);} // If the new origin is within the tail, then we do not need a root.
	if(newOrigin >= newTailOffset){newOrigin -= newTailOffset;newCapacity -= newTailOffset;newLevel = SHIFT;newRoot = null;newTail = newTail && newTail.removeBefore(owner,0,newOrigin); // Otherwise, if the root has been trimmed, garbage collect.
	}else if(newOrigin > oldOrigin || newTailOffset < oldTailOffset){offsetShift = 0; // Identify the new top root node of the subtree of the old root.
	while(newRoot) {var beginIndex=newOrigin >>> newLevel & MASK;if(beginIndex !== newTailOffset >>> newLevel & MASK){break;}if(beginIndex){offsetShift += (1 << newLevel) * beginIndex;}newLevel -= SHIFT;newRoot = newRoot.array[beginIndex];} // Trim the new sides of the new root.
	if(newRoot && newOrigin > oldOrigin){newRoot = newRoot.removeBefore(owner,newLevel,newOrigin - offsetShift);}if(newRoot && newTailOffset < oldTailOffset){newRoot = newRoot.removeAfter(owner,newLevel,newTailOffset - offsetShift);}if(offsetShift){newOrigin -= offsetShift;newCapacity -= offsetShift;}}if(list.__ownerID){list.size = newCapacity - newOrigin;list._origin = newOrigin;list._capacity = newCapacity;list._level = newLevel;list._root = newRoot;list._tail = newTail;list.__hash = undefined;list.__altered = true;return list;}return makeList(newOrigin,newCapacity,newLevel,newRoot,newTail);}function mergeIntoListWith(list,merger,iterables){var iters=[];var maxSize=0;for(var ii=0;ii < iterables.length;ii++) {var value=iterables[ii];var iter=IndexedIterable(value);if(iter.size > maxSize){maxSize = iter.size;}if(!isIterable(value)){iter = iter.map(function(v){return fromJS(v);});}iters.push(iter);}if(maxSize > list.size){list = list.setSize(maxSize);}return mergeIntoCollectionWith(list,merger,iters);}function getTailOffset(size){return size < SIZE?0:size - 1 >>> SHIFT << SHIFT;}createClass(OrderedMap,Map); // @pragma Construction
	function OrderedMap(value){return value === null || value === undefined?emptyOrderedMap():isOrderedMap(value)?value:emptyOrderedMap().withMutations(function(map){var iter=KeyedIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v,k){return map.set(k,v);});});}OrderedMap.of = function() /*...values*/{return this(arguments);};OrderedMap.prototype.toString = function(){return this.__toString('OrderedMap {','}');}; // @pragma Access
	OrderedMap.prototype.get = function(k,notSetValue){var index=this._map.get(k);return index !== undefined?this._list.get(index)[1]:notSetValue;}; // @pragma Modification
	OrderedMap.prototype.clear = function(){if(this.size === 0){return this;}if(this.__ownerID){this.size = 0;this._map.clear();this._list.clear();return this;}return emptyOrderedMap();};OrderedMap.prototype.set = function(k,v){return updateOrderedMap(this,k,v);};OrderedMap.prototype.remove = function(k){return updateOrderedMap(this,k,NOT_SET);};OrderedMap.prototype.wasAltered = function(){return this._map.wasAltered() || this._list.wasAltered();};OrderedMap.prototype.__iterate = function(fn,reverse){var this$0=this;return this._list.__iterate(function(entry){return entry && fn(entry[1],entry[0],this$0);},reverse);};OrderedMap.prototype.__iterator = function(type,reverse){return this._list.fromEntrySeq().__iterator(type,reverse);};OrderedMap.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}var newMap=this._map.__ensureOwner(ownerID);var newList=this._list.__ensureOwner(ownerID);if(!ownerID){this.__ownerID = ownerID;this._map = newMap;this._list = newList;return this;}return makeOrderedMap(newMap,newList,ownerID,this.__hash);};function isOrderedMap(maybeOrderedMap){return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);}OrderedMap.isOrderedMap = isOrderedMap;OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;function makeOrderedMap(map,list,ownerID,hash){var omap=Object.create(OrderedMap.prototype);omap.size = map?map.size:0;omap._map = map;omap._list = list;omap.__ownerID = ownerID;omap.__hash = hash;return omap;}var EMPTY_ORDERED_MAP;function emptyOrderedMap(){return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(),emptyList()));}function updateOrderedMap(omap,k,v){var map=omap._map;var list=omap._list;var i=map.get(k);var has=i !== undefined;var newMap;var newList;if(v === NOT_SET){ // removed
	if(!has){return omap;}if(list.size >= SIZE && list.size >= map.size * 2){newList = list.filter(function(entry,idx){return entry !== undefined && i !== idx;});newMap = newList.toKeyedSeq().map(function(entry){return entry[0];}).flip().toMap();if(omap.__ownerID){newMap.__ownerID = newList.__ownerID = omap.__ownerID;}}else {newMap = map.remove(k);newList = i === list.size - 1?list.pop():list.set(i,undefined);}}else {if(has){if(v === list.get(i)[1]){return omap;}newMap = map;newList = list.set(i,[k,v]);}else {newMap = map.set(k,list.size);newList = list.set(list.size,[k,v]);}}if(omap.__ownerID){omap.size = newMap.size;omap._map = newMap;omap._list = newList;omap.__hash = undefined;return omap;}return makeOrderedMap(newMap,newList);}createClass(ToKeyedSequence,KeyedSeq);function ToKeyedSequence(indexed,useKeys){this._iter = indexed;this._useKeys = useKeys;this.size = indexed.size;}ToKeyedSequence.prototype.get = function(key,notSetValue){return this._iter.get(key,notSetValue);};ToKeyedSequence.prototype.has = function(key){return this._iter.has(key);};ToKeyedSequence.prototype.valueSeq = function(){return this._iter.valueSeq();};ToKeyedSequence.prototype.reverse = function(){var this$0=this;var reversedSequence=reverseFactory(this,true);if(!this._useKeys){reversedSequence.valueSeq = function(){return this$0._iter.toSeq().reverse();};}return reversedSequence;};ToKeyedSequence.prototype.map = function(mapper,context){var this$0=this;var mappedSequence=mapFactory(this,mapper,context);if(!this._useKeys){mappedSequence.valueSeq = function(){return this$0._iter.toSeq().map(mapper,context);};}return mappedSequence;};ToKeyedSequence.prototype.__iterate = function(fn,reverse){var this$0=this;var ii;return this._iter.__iterate(this._useKeys?function(v,k){return fn(v,k,this$0);}:(ii = reverse?resolveSize(this):0,function(v){return fn(v,reverse?--ii:ii++,this$0);}),reverse);};ToKeyedSequence.prototype.__iterator = function(type,reverse){if(this._useKeys){return this._iter.__iterator(type,reverse);}var iterator=this._iter.__iterator(ITERATE_VALUES,reverse);var ii=reverse?resolveSize(this):0;return new Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type,reverse?--ii:ii++,step.value,step);});};ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;createClass(ToIndexedSequence,IndexedSeq);function ToIndexedSequence(iter){this._iter = iter;this.size = iter.size;}ToIndexedSequence.prototype.includes = function(value){return this._iter.includes(value);};ToIndexedSequence.prototype.__iterate = function(fn,reverse){var this$0=this;var iterations=0;return this._iter.__iterate(function(v){return fn(v,iterations++,this$0);},reverse);};ToIndexedSequence.prototype.__iterator = function(type,reverse){var iterator=this._iter.__iterator(ITERATE_VALUES,reverse);var iterations=0;return new Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type,iterations++,step.value,step);});};createClass(ToSetSequence,SetSeq);function ToSetSequence(iter){this._iter = iter;this.size = iter.size;}ToSetSequence.prototype.has = function(key){return this._iter.includes(key);};ToSetSequence.prototype.__iterate = function(fn,reverse){var this$0=this;return this._iter.__iterate(function(v){return fn(v,v,this$0);},reverse);};ToSetSequence.prototype.__iterator = function(type,reverse){var iterator=this._iter.__iterator(ITERATE_VALUES,reverse);return new Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type,step.value,step.value,step);});};createClass(FromEntriesSequence,KeyedSeq);function FromEntriesSequence(entries){this._iter = entries;this.size = entries.size;}FromEntriesSequence.prototype.entrySeq = function(){return this._iter.toSeq();};FromEntriesSequence.prototype.__iterate = function(fn,reverse){var this$0=this;return this._iter.__iterate(function(entry){ // Check if entry exists first so array access doesn't throw for holes
	// in the parent iteration.
	if(entry){validateEntry(entry);var indexedIterable=isIterable(entry);return fn(indexedIterable?entry.get(1):entry[1],indexedIterable?entry.get(0):entry[0],this$0);}},reverse);};FromEntriesSequence.prototype.__iterator = function(type,reverse){var iterator=this._iter.__iterator(ITERATE_VALUES,reverse);return new Iterator(function(){while(true) {var step=iterator.next();if(step.done){return step;}var entry=step.value; // Check if entry exists first so array access doesn't throw for holes
	// in the parent iteration.
	if(entry){validateEntry(entry);var indexedIterable=isIterable(entry);return iteratorValue(type,indexedIterable?entry.get(0):entry[0],indexedIterable?entry.get(1):entry[1],step);}}});};ToIndexedSequence.prototype.cacheResult = ToKeyedSequence.prototype.cacheResult = ToSetSequence.prototype.cacheResult = FromEntriesSequence.prototype.cacheResult = cacheResultThrough;function flipFactory(iterable){var flipSequence=makeSequence(iterable);flipSequence._iter = iterable;flipSequence.size = iterable.size;flipSequence.flip = function(){return iterable;};flipSequence.reverse = function(){var reversedSequence=iterable.reverse.apply(this); // super.reverse()
	reversedSequence.flip = function(){return iterable.reverse();};return reversedSequence;};flipSequence.has = function(key){return iterable.includes(key);};flipSequence.includes = function(key){return iterable.has(key);};flipSequence.cacheResult = cacheResultThrough;flipSequence.__iterateUncached = function(fn,reverse){var this$0=this;return iterable.__iterate(function(v,k){return fn(k,v,this$0) !== false;},reverse);};flipSequence.__iteratorUncached = function(type,reverse){if(type === ITERATE_ENTRIES){var iterator=iterable.__iterator(type,reverse);return new Iterator(function(){var step=iterator.next();if(!step.done){var k=step.value[0];step.value[0] = step.value[1];step.value[1] = k;}return step;});}return iterable.__iterator(type === ITERATE_VALUES?ITERATE_KEYS:ITERATE_VALUES,reverse);};return flipSequence;}function mapFactory(iterable,mapper,context){var mappedSequence=makeSequence(iterable);mappedSequence.size = iterable.size;mappedSequence.has = function(key){return iterable.has(key);};mappedSequence.get = function(key,notSetValue){var v=iterable.get(key,NOT_SET);return v === NOT_SET?notSetValue:mapper.call(context,v,key,iterable);};mappedSequence.__iterateUncached = function(fn,reverse){var this$0=this;return iterable.__iterate(function(v,k,c){return fn(mapper.call(context,v,k,c),k,this$0) !== false;},reverse);};mappedSequence.__iteratorUncached = function(type,reverse){var iterator=iterable.__iterator(ITERATE_ENTRIES,reverse);return new Iterator(function(){var step=iterator.next();if(step.done){return step;}var entry=step.value;var key=entry[0];return iteratorValue(type,key,mapper.call(context,entry[1],key,iterable),step);});};return mappedSequence;}function reverseFactory(iterable,useKeys){var reversedSequence=makeSequence(iterable);reversedSequence._iter = iterable;reversedSequence.size = iterable.size;reversedSequence.reverse = function(){return iterable;};if(iterable.flip){reversedSequence.flip = function(){var flipSequence=flipFactory(iterable);flipSequence.reverse = function(){return iterable.flip();};return flipSequence;};}reversedSequence.get = function(key,notSetValue){return iterable.get(useKeys?key:-1 - key,notSetValue);};reversedSequence.has = function(key){return iterable.has(useKeys?key:-1 - key);};reversedSequence.includes = function(value){return iterable.includes(value);};reversedSequence.cacheResult = cacheResultThrough;reversedSequence.__iterate = function(fn,reverse){var this$0=this;return iterable.__iterate(function(v,k){return fn(v,k,this$0);},!reverse);};reversedSequence.__iterator = function(type,reverse){return iterable.__iterator(type,!reverse);};return reversedSequence;}function filterFactory(iterable,predicate,context,useKeys){var filterSequence=makeSequence(iterable);if(useKeys){filterSequence.has = function(key){var v=iterable.get(key,NOT_SET);return v !== NOT_SET && !!predicate.call(context,v,key,iterable);};filterSequence.get = function(key,notSetValue){var v=iterable.get(key,NOT_SET);return v !== NOT_SET && predicate.call(context,v,key,iterable)?v:notSetValue;};}filterSequence.__iterateUncached = function(fn,reverse){var this$0=this;var iterations=0;iterable.__iterate(function(v,k,c){if(predicate.call(context,v,k,c)){iterations++;return fn(v,useKeys?k:iterations - 1,this$0);}},reverse);return iterations;};filterSequence.__iteratorUncached = function(type,reverse){var iterator=iterable.__iterator(ITERATE_ENTRIES,reverse);var iterations=0;return new Iterator(function(){while(true) {var step=iterator.next();if(step.done){return step;}var entry=step.value;var key=entry[0];var value=entry[1];if(predicate.call(context,value,key,iterable)){return iteratorValue(type,useKeys?key:iterations++,value,step);}}});};return filterSequence;}function countByFactory(iterable,grouper,context){var groups=Map().asMutable();iterable.__iterate(function(v,k){groups.update(grouper.call(context,v,k,iterable),0,function(a){return a + 1;});});return groups.asImmutable();}function groupByFactory(iterable,grouper,context){var isKeyedIter=isKeyed(iterable);var groups=(isOrdered(iterable)?OrderedMap():Map()).asMutable();iterable.__iterate(function(v,k){groups.update(grouper.call(context,v,k,iterable),function(a){return a = a || [],a.push(isKeyedIter?[k,v]:v),a;});});var coerce=iterableClass(iterable);return groups.map(function(arr){return reify(iterable,coerce(arr));});}function sliceFactory(_x,_x2,_x3,_x4){var _again=true;_function: while(_again) {var iterable=_x,begin=_x2,end=_x3,useKeys=_x4;_again = false;var originalSize=iterable.size; // Sanitize begin & end using this shorthand for ToInt32(argument)
	// http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
	if(begin !== undefined){begin = begin | 0;}if(end !== undefined){if(end === Infinity){end = originalSize;}else {end = end | 0;}}if(wholeSlice(begin,end,originalSize)){return iterable;}var resolvedBegin=resolveBegin(begin,originalSize);var resolvedEnd=resolveEnd(end,originalSize); // begin or end will be NaN if they were provided as negative numbers and
	// this iterable's size is unknown. In that case, cache first so there is
	// a known size and these do not resolve to NaN.
	if(resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd){_x = iterable.toSeq().cacheResult();_x2 = begin;_x3 = end;_x4 = useKeys;_again = true;originalSize = resolvedBegin = resolvedEnd = undefined;continue _function;} // Note: resolvedEnd is undefined when the original sequence's length is
	// unknown and this slice did not supply an end and should contain all
	// elements after resolvedBegin.
	// In that case, resolvedSize will be NaN and sliceSize will remain undefined.
	var resolvedSize=resolvedEnd - resolvedBegin;var sliceSize;if(resolvedSize === resolvedSize){sliceSize = resolvedSize < 0?0:resolvedSize;}var sliceSeq=makeSequence(iterable); // If iterable.size is undefined, the size of the realized sliceSeq is
	// unknown at this point unless the number of items to slice is 0
	sliceSeq.size = sliceSize === 0?sliceSize:iterable.size && sliceSize || undefined;if(!useKeys && isSeq(iterable) && sliceSize >= 0){sliceSeq.get = function(index,notSetValue){index = wrapIndex(this,index);return index >= 0 && index < sliceSize?iterable.get(index + resolvedBegin,notSetValue):notSetValue;};}sliceSeq.__iterateUncached = function(fn,reverse){var this$0=this;if(sliceSize === 0){return 0;}if(reverse){return this.cacheResult().__iterate(fn,reverse);}var skipped=0;var isSkipping=true;var iterations=0;iterable.__iterate(function(v,k){if(!(isSkipping && (isSkipping = skipped++ < resolvedBegin))){iterations++;return fn(v,useKeys?k:iterations - 1,this$0) !== false && iterations !== sliceSize;}});return iterations;};sliceSeq.__iteratorUncached = function(type,reverse){if(sliceSize !== 0 && reverse){return this.cacheResult().__iterator(type,reverse);} // Don't bother instantiating parent iterator if taking 0.
	var iterator=sliceSize !== 0 && iterable.__iterator(type,reverse);var skipped=0;var iterations=0;return new Iterator(function(){while(skipped++ < resolvedBegin) {iterator.next();}if(++iterations > sliceSize){return iteratorDone();}var step=iterator.next();if(useKeys || type === ITERATE_VALUES){return step;}else if(type === ITERATE_KEYS){return iteratorValue(type,iterations - 1,undefined,step);}else {return iteratorValue(type,iterations - 1,step.value[1],step);}});};return sliceSeq;}}function takeWhileFactory(iterable,predicate,context){var takeSequence=makeSequence(iterable);takeSequence.__iterateUncached = function(fn,reverse){var this$0=this;if(reverse){return this.cacheResult().__iterate(fn,reverse);}var iterations=0;iterable.__iterate(function(v,k,c){return predicate.call(context,v,k,c) && ++iterations && fn(v,k,this$0);});return iterations;};takeSequence.__iteratorUncached = function(type,reverse){var this$0=this;if(reverse){return this.cacheResult().__iterator(type,reverse);}var iterator=iterable.__iterator(ITERATE_ENTRIES,reverse);var iterating=true;return new Iterator(function(){if(!iterating){return iteratorDone();}var step=iterator.next();if(step.done){return step;}var entry=step.value;var k=entry[0];var v=entry[1];if(!predicate.call(context,v,k,this$0)){iterating = false;return iteratorDone();}return type === ITERATE_ENTRIES?step:iteratorValue(type,k,v,step);});};return takeSequence;}function skipWhileFactory(iterable,predicate,context,useKeys){var skipSequence=makeSequence(iterable);skipSequence.__iterateUncached = function(fn,reverse){var this$0=this;if(reverse){return this.cacheResult().__iterate(fn,reverse);}var isSkipping=true;var iterations=0;iterable.__iterate(function(v,k,c){if(!(isSkipping && (isSkipping = predicate.call(context,v,k,c)))){iterations++;return fn(v,useKeys?k:iterations - 1,this$0);}});return iterations;};skipSequence.__iteratorUncached = function(type,reverse){var this$0=this;if(reverse){return this.cacheResult().__iterator(type,reverse);}var iterator=iterable.__iterator(ITERATE_ENTRIES,reverse);var skipping=true;var iterations=0;return new Iterator(function(){var step,k,v;do {step = iterator.next();if(step.done){if(useKeys || type === ITERATE_VALUES){return step;}else if(type === ITERATE_KEYS){return iteratorValue(type,iterations++,undefined,step);}else {return iteratorValue(type,iterations++,step.value[1],step);}}var entry=step.value;k = entry[0];v = entry[1];skipping && (skipping = predicate.call(context,v,k,this$0));}while(skipping);return type === ITERATE_ENTRIES?step:iteratorValue(type,k,v,step);});};return skipSequence;}function concatFactory(iterable,values){var isKeyedIterable=isKeyed(iterable);var iters=[iterable].concat(values).map(function(v){if(!isIterable(v)){v = isKeyedIterable?keyedSeqFromValue(v):indexedSeqFromValue(Array.isArray(v)?v:[v]);}else if(isKeyedIterable){v = KeyedIterable(v);}return v;}).filter(function(v){return v.size !== 0;});if(iters.length === 0){return iterable;}if(iters.length === 1){var singleton=iters[0];if(singleton === iterable || isKeyedIterable && isKeyed(singleton) || isIndexed(iterable) && isIndexed(singleton)){return singleton;}}var concatSeq=new ArraySeq(iters);if(isKeyedIterable){concatSeq = concatSeq.toKeyedSeq();}else if(!isIndexed(iterable)){concatSeq = concatSeq.toSetSeq();}concatSeq = concatSeq.flatten(true);concatSeq.size = iters.reduce(function(sum,seq){if(sum !== undefined){var size=seq.size;if(size !== undefined){return sum + size;}}},0);return concatSeq;}function flattenFactory(iterable,depth,useKeys){var flatSequence=makeSequence(iterable);flatSequence.__iterateUncached = function(fn,reverse){var iterations=0;var stopped=false;function flatDeep(iter,currentDepth){var this$0=this;iter.__iterate(function(v,k){if((!depth || currentDepth < depth) && isIterable(v)){flatDeep(v,currentDepth + 1);}else if(fn(v,useKeys?k:iterations++,this$0) === false){stopped = true;}return !stopped;},reverse);}flatDeep(iterable,0);return iterations;};flatSequence.__iteratorUncached = function(type,reverse){var iterator=iterable.__iterator(type,reverse);var stack=[];var iterations=0;return new Iterator(function(){while(iterator) {var step=iterator.next();if(step.done !== false){iterator = stack.pop();continue;}var v=step.value;if(type === ITERATE_ENTRIES){v = v[1];}if((!depth || stack.length < depth) && isIterable(v)){stack.push(iterator);iterator = v.__iterator(type,reverse);}else {return useKeys?step:iteratorValue(type,iterations++,v,step);}}return iteratorDone();});};return flatSequence;}function flatMapFactory(iterable,mapper,context){var coerce=iterableClass(iterable);return iterable.toSeq().map(function(v,k){return coerce(mapper.call(context,v,k,iterable));}).flatten(true);}function interposeFactory(iterable,separator){var interposedSequence=makeSequence(iterable);interposedSequence.size = iterable.size && iterable.size * 2 - 1;interposedSequence.__iterateUncached = function(fn,reverse){var this$0=this;var iterations=0;iterable.__iterate(function(v,k){return (!iterations || fn(separator,iterations++,this$0) !== false) && fn(v,iterations++,this$0) !== false;},reverse);return iterations;};interposedSequence.__iteratorUncached = function(type,reverse){var iterator=iterable.__iterator(ITERATE_VALUES,reverse);var iterations=0;var step;return new Iterator(function(){if(!step || iterations % 2){step = iterator.next();if(step.done){return step;}}return iterations % 2?iteratorValue(type,iterations++,separator):iteratorValue(type,iterations++,step.value,step);});};return interposedSequence;}function sortFactory(iterable,comparator,mapper){if(!comparator){comparator = defaultComparator;}var isKeyedIterable=isKeyed(iterable);var index=0;var entries=iterable.toSeq().map(function(v,k){return [k,v,index++,mapper?mapper(v,k,iterable):v];}).toArray();entries.sort(function(a,b){return comparator(a[3],b[3]) || a[2] - b[2];}).forEach(isKeyedIterable?function(v,i){entries[i].length = 2;}:function(v,i){entries[i] = v[1];});return isKeyedIterable?KeyedSeq(entries):isIndexed(iterable)?IndexedSeq(entries):SetSeq(entries);}function maxFactory(iterable,comparator,mapper){if(!comparator){comparator = defaultComparator;}if(mapper){var entry=iterable.toSeq().map(function(v,k){return [v,mapper(v,k,iterable)];}).reduce(function(a,b){return maxCompare(comparator,a[1],b[1])?b:a;});return entry && entry[0];}else {return iterable.reduce(function(a,b){return maxCompare(comparator,a,b)?b:a;});}}function maxCompare(comparator,a,b){var comp=comparator(b,a); // b is considered the new max if the comparator declares them equal, but
	// they are not equal and b is in fact a nullish value.
	return comp === 0 && b !== a && (b === undefined || b === null || b !== b) || comp > 0;}function zipWithFactory(keyIter,zipper,iters){var zipSequence=makeSequence(keyIter);zipSequence.size = new ArraySeq(iters).map(function(i){return i.size;}).min(); // Note: this a generic base implementation of __iterate in terms of
	// __iterator which may be more generically useful in the future.
	zipSequence.__iterate = function(fn,reverse){ /* generic:
	      var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
	      var step;
	      var iterations = 0;
	      while (!(step = iterator.next()).done) {
	        iterations++;
	        if (fn(step.value[1], step.value[0], this) === false) {
	          break;
	        }
	      }
	      return iterations;
	      */ // indexed:
	var iterator=this.__iterator(ITERATE_VALUES,reverse);var step;var iterations=0;while(!(step = iterator.next()).done) {if(fn(step.value,iterations++,this) === false){break;}}return iterations;};zipSequence.__iteratorUncached = function(type,reverse){var iterators=iters.map(function(i){return i = Iterable(i),getIterator(reverse?i.reverse():i);});var iterations=0;var isDone=false;return new Iterator(function(){var steps;if(!isDone){steps = iterators.map(function(i){return i.next();});isDone = steps.some(function(s){return s.done;});}if(isDone){return iteratorDone();}return iteratorValue(type,iterations++,zipper.apply(null,steps.map(function(s){return s.value;})));});};return zipSequence;} // #pragma Helper Functions
	function reify(iter,seq){return isSeq(iter)?seq:iter.constructor(seq);}function validateEntry(entry){if(entry !== Object(entry)){throw new TypeError('Expected [K, V] tuple: ' + entry);}}function resolveSize(iter){assertNotInfinite(iter.size);return ensureSize(iter);}function iterableClass(iterable){return isKeyed(iterable)?KeyedIterable:isIndexed(iterable)?IndexedIterable:SetIterable;}function makeSequence(iterable){return Object.create((isKeyed(iterable)?KeyedSeq:isIndexed(iterable)?IndexedSeq:SetSeq).prototype);}function cacheResultThrough(){if(this._iter.cacheResult){this._iter.cacheResult();this.size = this._iter.size;return this;}else {return Seq.prototype.cacheResult.call(this);}}function defaultComparator(a,b){return a > b?1:a < b?-1:0;}function forceIterator(keyPath){var iter=getIterator(keyPath);if(!iter){ // Array might not be iterable in this environment, so we need a fallback
	// to our wrapped type.
	if(!isArrayLike(keyPath)){throw new TypeError('Expected iterable or array-like: ' + keyPath);}iter = getIterator(Iterable(keyPath));}return iter;}createClass(Record,KeyedCollection);function Record(defaultValues,name){var hasInitialized;var RecordType=function Record(values){if(values instanceof RecordType){return values;}if(!(this instanceof RecordType)){return new RecordType(values);}if(!hasInitialized){hasInitialized = true;var keys=Object.keys(defaultValues);setProps(RecordTypePrototype,keys);RecordTypePrototype.size = keys.length;RecordTypePrototype._name = name;RecordTypePrototype._keys = keys;RecordTypePrototype._defaultValues = defaultValues;}this._map = Map(values);};var RecordTypePrototype=RecordType.prototype = Object.create(RecordPrototype);RecordTypePrototype.constructor = RecordType;return RecordType;}Record.prototype.toString = function(){return this.__toString(recordName(this) + ' {','}');}; // @pragma Access
	Record.prototype.has = function(k){return this._defaultValues.hasOwnProperty(k);};Record.prototype.get = function(k,notSetValue){if(!this.has(k)){return notSetValue;}var defaultVal=this._defaultValues[k];return this._map?this._map.get(k,defaultVal):defaultVal;}; // @pragma Modification
	Record.prototype.clear = function(){if(this.__ownerID){this._map && this._map.clear();return this;}var RecordType=this.constructor;return RecordType._empty || (RecordType._empty = makeRecord(this,emptyMap()));};Record.prototype.set = function(k,v){if(!this.has(k)){throw new Error('Cannot set unknown key "' + k + '" on ' + recordName(this));}if(this._map && !this._map.has(k)){var defaultVal=this._defaultValues[k];if(v === defaultVal){return this;}}var newMap=this._map && this._map.set(k,v);if(this.__ownerID || newMap === this._map){return this;}return makeRecord(this,newMap);};Record.prototype.remove = function(k){if(!this.has(k)){return this;}var newMap=this._map && this._map.remove(k);if(this.__ownerID || newMap === this._map){return this;}return makeRecord(this,newMap);};Record.prototype.wasAltered = function(){return this._map.wasAltered();};Record.prototype.__iterator = function(type,reverse){var this$0=this;return KeyedIterable(this._defaultValues).map(function(_,k){return this$0.get(k);}).__iterator(type,reverse);};Record.prototype.__iterate = function(fn,reverse){var this$0=this;return KeyedIterable(this._defaultValues).map(function(_,k){return this$0.get(k);}).__iterate(fn,reverse);};Record.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}var newMap=this._map && this._map.__ensureOwner(ownerID);if(!ownerID){this.__ownerID = ownerID;this._map = newMap;return this;}return makeRecord(this,newMap,ownerID);};var RecordPrototype=Record.prototype;RecordPrototype[DELETE] = RecordPrototype.remove;RecordPrototype.deleteIn = RecordPrototype.removeIn = MapPrototype.removeIn;RecordPrototype.merge = MapPrototype.merge;RecordPrototype.mergeWith = MapPrototype.mergeWith;RecordPrototype.mergeIn = MapPrototype.mergeIn;RecordPrototype.mergeDeep = MapPrototype.mergeDeep;RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;RecordPrototype.setIn = MapPrototype.setIn;RecordPrototype.update = MapPrototype.update;RecordPrototype.updateIn = MapPrototype.updateIn;RecordPrototype.withMutations = MapPrototype.withMutations;RecordPrototype.asMutable = MapPrototype.asMutable;RecordPrototype.asImmutable = MapPrototype.asImmutable;function makeRecord(likeRecord,map,ownerID){var record=Object.create(Object.getPrototypeOf(likeRecord));record._map = map;record.__ownerID = ownerID;return record;}function recordName(record){return record._name || record.constructor.name || 'Record';}function setProps(prototype,names){try{names.forEach(setProp.bind(undefined,prototype));}catch(error) { // Object.defineProperty failed. Probably IE8.
	}}function setProp(prototype,name){Object.defineProperty(prototype,name,{get:function get(){return this.get(name);},set:function set(value){invariant(this.__ownerID,'Cannot set on an immutable record.');this.set(name,value);}});}createClass(Set,SetCollection); // @pragma Construction
	function Set(value){return value === null || value === undefined?emptySet():isSet(value) && !isOrdered(value)?value:emptySet().withMutations(function(set){var iter=SetIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v){return set.add(v);});});}Set.of = function() /*...values*/{return this(arguments);};Set.fromKeys = function(value){return this(KeyedIterable(value).keySeq());};Set.prototype.toString = function(){return this.__toString('Set {','}');}; // @pragma Access
	Set.prototype.has = function(value){return this._map.has(value);}; // @pragma Modification
	Set.prototype.add = function(value){return updateSet(this,this._map.set(value,true));};Set.prototype.remove = function(value){return updateSet(this,this._map.remove(value));};Set.prototype.clear = function(){return updateSet(this,this._map.clear());}; // @pragma Composition
	Set.prototype.union = function(){var iters=SLICE$0.call(arguments,0);iters = iters.filter(function(x){return x.size !== 0;});if(iters.length === 0){return this;}if(this.size === 0 && !this.__ownerID && iters.length === 1){return this.constructor(iters[0]);}return this.withMutations(function(set){for(var ii=0;ii < iters.length;ii++) {SetIterable(iters[ii]).forEach(function(value){return set.add(value);});}});};Set.prototype.intersect = function(){var iters=SLICE$0.call(arguments,0);if(iters.length === 0){return this;}iters = iters.map(function(iter){return SetIterable(iter);});var originalSet=this;return this.withMutations(function(set){originalSet.forEach(function(value){if(!iters.every(function(iter){return iter.includes(value);})){set.remove(value);}});});};Set.prototype.subtract = function(){var iters=SLICE$0.call(arguments,0);if(iters.length === 0){return this;}iters = iters.map(function(iter){return SetIterable(iter);});var originalSet=this;return this.withMutations(function(set){originalSet.forEach(function(value){if(iters.some(function(iter){return iter.includes(value);})){set.remove(value);}});});};Set.prototype.merge = function(){return this.union.apply(this,arguments);};Set.prototype.mergeWith = function(merger){var iters=SLICE$0.call(arguments,1);return this.union.apply(this,iters);};Set.prototype.sort = function(comparator){ // Late binding
	return OrderedSet(sortFactory(this,comparator));};Set.prototype.sortBy = function(mapper,comparator){ // Late binding
	return OrderedSet(sortFactory(this,comparator,mapper));};Set.prototype.wasAltered = function(){return this._map.wasAltered();};Set.prototype.__iterate = function(fn,reverse){var this$0=this;return this._map.__iterate(function(_,k){return fn(k,k,this$0);},reverse);};Set.prototype.__iterator = function(type,reverse){return this._map.map(function(_,k){return k;}).__iterator(type,reverse);};Set.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}var newMap=this._map.__ensureOwner(ownerID);if(!ownerID){this.__ownerID = ownerID;this._map = newMap;return this;}return this.__make(newMap,ownerID);};function isSet(maybeSet){return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);}Set.isSet = isSet;var IS_SET_SENTINEL='@@__IMMUTABLE_SET__@@';var SetPrototype=Set.prototype;SetPrototype[IS_SET_SENTINEL] = true;SetPrototype[DELETE] = SetPrototype.remove;SetPrototype.mergeDeep = SetPrototype.merge;SetPrototype.mergeDeepWith = SetPrototype.mergeWith;SetPrototype.withMutations = MapPrototype.withMutations;SetPrototype.asMutable = MapPrototype.asMutable;SetPrototype.asImmutable = MapPrototype.asImmutable;SetPrototype.__empty = emptySet;SetPrototype.__make = makeSet;function updateSet(set,newMap){if(set.__ownerID){set.size = newMap.size;set._map = newMap;return set;}return newMap === set._map?set:newMap.size === 0?set.__empty():set.__make(newMap);}function makeSet(map,ownerID){var set=Object.create(SetPrototype);set.size = map?map.size:0;set._map = map;set.__ownerID = ownerID;return set;}var EMPTY_SET;function emptySet(){return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));}createClass(OrderedSet,Set); // @pragma Construction
	function OrderedSet(value){return value === null || value === undefined?emptyOrderedSet():isOrderedSet(value)?value:emptyOrderedSet().withMutations(function(set){var iter=SetIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v){return set.add(v);});});}OrderedSet.of = function() /*...values*/{return this(arguments);};OrderedSet.fromKeys = function(value){return this(KeyedIterable(value).keySeq());};OrderedSet.prototype.toString = function(){return this.__toString('OrderedSet {','}');};function isOrderedSet(maybeOrderedSet){return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);}OrderedSet.isOrderedSet = isOrderedSet;var OrderedSetPrototype=OrderedSet.prototype;OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;OrderedSetPrototype.__empty = emptyOrderedSet;OrderedSetPrototype.__make = makeOrderedSet;function makeOrderedSet(map,ownerID){var set=Object.create(OrderedSetPrototype);set.size = map?map.size:0;set._map = map;set.__ownerID = ownerID;return set;}var EMPTY_ORDERED_SET;function emptyOrderedSet(){return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));}createClass(Stack,IndexedCollection); // @pragma Construction
	function Stack(value){return value === null || value === undefined?emptyStack():isStack(value)?value:emptyStack().unshiftAll(value);}Stack.of = function() /*...values*/{return this(arguments);};Stack.prototype.toString = function(){return this.__toString('Stack [',']');}; // @pragma Access
	Stack.prototype.get = function(index,notSetValue){var head=this._head;index = wrapIndex(this,index);while(head && index--) {head = head.next;}return head?head.value:notSetValue;};Stack.prototype.peek = function(){return this._head && this._head.value;}; // @pragma Modification
	Stack.prototype.push = function() /*...values*/{if(arguments.length === 0){return this;}var newSize=this.size + arguments.length;var head=this._head;for(var ii=arguments.length - 1;ii >= 0;ii--) {head = {value:arguments[ii],next:head};}if(this.__ownerID){this.size = newSize;this._head = head;this.__hash = undefined;this.__altered = true;return this;}return makeStack(newSize,head);};Stack.prototype.pushAll = function(iter){iter = IndexedIterable(iter);if(iter.size === 0){return this;}assertNotInfinite(iter.size);var newSize=this.size;var head=this._head;iter.reverse().forEach(function(value){newSize++;head = {value:value,next:head};});if(this.__ownerID){this.size = newSize;this._head = head;this.__hash = undefined;this.__altered = true;return this;}return makeStack(newSize,head);};Stack.prototype.pop = function(){return this.slice(1);};Stack.prototype.unshift = function() /*...values*/{return this.push.apply(this,arguments);};Stack.prototype.unshiftAll = function(iter){return this.pushAll(iter);};Stack.prototype.shift = function(){return this.pop.apply(this,arguments);};Stack.prototype.clear = function(){if(this.size === 0){return this;}if(this.__ownerID){this.size = 0;this._head = undefined;this.__hash = undefined;this.__altered = true;return this;}return emptyStack();};Stack.prototype.slice = function(begin,end){if(wholeSlice(begin,end,this.size)){return this;}var resolvedBegin=resolveBegin(begin,this.size);var resolvedEnd=resolveEnd(end,this.size);if(resolvedEnd !== this.size){ // super.slice(begin, end);
	return IndexedCollection.prototype.slice.call(this,begin,end);}var newSize=this.size - resolvedBegin;var head=this._head;while(resolvedBegin--) {head = head.next;}if(this.__ownerID){this.size = newSize;this._head = head;this.__hash = undefined;this.__altered = true;return this;}return makeStack(newSize,head);}; // @pragma Mutability
	Stack.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}if(!ownerID){this.__ownerID = ownerID;this.__altered = false;return this;}return makeStack(this.size,this._head,ownerID,this.__hash);}; // @pragma Iteration
	Stack.prototype.__iterate = function(fn,reverse){if(reverse){return this.reverse().__iterate(fn);}var iterations=0;var node=this._head;while(node) {if(fn(node.value,iterations++,this) === false){break;}node = node.next;}return iterations;};Stack.prototype.__iterator = function(type,reverse){if(reverse){return this.reverse().__iterator(type);}var iterations=0;var node=this._head;return new Iterator(function(){if(node){var value=node.value;node = node.next;return iteratorValue(type,iterations++,value);}return iteratorDone();});};function isStack(maybeStack){return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);}Stack.isStack = isStack;var IS_STACK_SENTINEL='@@__IMMUTABLE_STACK__@@';var StackPrototype=Stack.prototype;StackPrototype[IS_STACK_SENTINEL] = true;StackPrototype.withMutations = MapPrototype.withMutations;StackPrototype.asMutable = MapPrototype.asMutable;StackPrototype.asImmutable = MapPrototype.asImmutable;StackPrototype.wasAltered = MapPrototype.wasAltered;function makeStack(size,head,ownerID,hash){var map=Object.create(StackPrototype);map.size = size;map._head = head;map.__ownerID = ownerID;map.__hash = hash;map.__altered = false;return map;}var EMPTY_STACK;function emptyStack(){return EMPTY_STACK || (EMPTY_STACK = makeStack(0));} /**
	   * Contributes additional methods to a constructor
	   */function mixin(ctor,methods){var keyCopier=function keyCopier(key){ctor.prototype[key] = methods[key];};Object.keys(methods).forEach(keyCopier);Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(methods).forEach(keyCopier);return ctor;}Iterable.Iterator = Iterator;mixin(Iterable,{ // ### Conversion to other types
	toArray:function toArray(){assertNotInfinite(this.size);var array=new Array(this.size || 0);this.valueSeq().__iterate(function(v,i){array[i] = v;});return array;},toIndexedSeq:function toIndexedSeq(){return new ToIndexedSequence(this);},toJS:function toJS(){return this.toSeq().map(function(value){return value && typeof value.toJS === 'function'?value.toJS():value;}).__toJS();},toJSON:function toJSON(){return this.toSeq().map(function(value){return value && typeof value.toJSON === 'function'?value.toJSON():value;}).__toJS();},toKeyedSeq:function toKeyedSeq(){return new ToKeyedSequence(this,true);},toMap:function toMap(){ // Use Late Binding here to solve the circular dependency.
	return Map(this.toKeyedSeq());},toObject:function toObject(){assertNotInfinite(this.size);var object={};this.__iterate(function(v,k){object[k] = v;});return object;},toOrderedMap:function toOrderedMap(){ // Use Late Binding here to solve the circular dependency.
	return OrderedMap(this.toKeyedSeq());},toOrderedSet:function toOrderedSet(){ // Use Late Binding here to solve the circular dependency.
	return OrderedSet(isKeyed(this)?this.valueSeq():this);},toSet:function toSet(){ // Use Late Binding here to solve the circular dependency.
	return Set(isKeyed(this)?this.valueSeq():this);},toSetSeq:function toSetSeq(){return new ToSetSequence(this);},toSeq:function toSeq(){return isIndexed(this)?this.toIndexedSeq():isKeyed(this)?this.toKeyedSeq():this.toSetSeq();},toStack:function toStack(){ // Use Late Binding here to solve the circular dependency.
	return Stack(isKeyed(this)?this.valueSeq():this);},toList:function toList(){ // Use Late Binding here to solve the circular dependency.
	return List(isKeyed(this)?this.valueSeq():this);}, // ### Common JavaScript methods and properties
	toString:function toString(){return '[Iterable]';},__toString:function __toString(head,tail){if(this.size === 0){return head + tail;}return head + ' ' + this.toSeq().map(this.__toStringMapper).join(', ') + ' ' + tail;}, // ### ES6 Collection methods (ES6 Array and Map)
	concat:function concat(){var values=SLICE$0.call(arguments,0);return reify(this,concatFactory(this,values));},includes:function includes(searchValue){return this.some(function(value){return is(value,searchValue);});},entries:function entries(){return this.__iterator(ITERATE_ENTRIES);},every:function every(predicate,context){assertNotInfinite(this.size);var returnValue=true;this.__iterate(function(v,k,c){if(!predicate.call(context,v,k,c)){returnValue = false;return false;}});return returnValue;},filter:function filter(predicate,context){return reify(this,filterFactory(this,predicate,context,true));},find:function find(predicate,context,notSetValue){var entry=this.findEntry(predicate,context);return entry?entry[1]:notSetValue;},forEach:function forEach(sideEffect,context){assertNotInfinite(this.size);return this.__iterate(context?sideEffect.bind(context):sideEffect);},join:function join(separator){assertNotInfinite(this.size);separator = separator !== undefined?'' + separator:',';var joined='';var isFirst=true;this.__iterate(function(v){isFirst?isFirst = false:joined += separator;joined += v !== null && v !== undefined?v.toString():'';});return joined;},keys:function keys(){return this.__iterator(ITERATE_KEYS);},map:function map(mapper,context){return reify(this,mapFactory(this,mapper,context));},reduce:function reduce(reducer,initialReduction,context){assertNotInfinite(this.size);var reduction;var useFirst;if(arguments.length < 2){useFirst = true;}else {reduction = initialReduction;}this.__iterate(function(v,k,c){if(useFirst){useFirst = false;reduction = v;}else {reduction = reducer.call(context,reduction,v,k,c);}});return reduction;},reduceRight:function reduceRight(reducer,initialReduction,context){var reversed=this.toKeyedSeq().reverse();return reversed.reduce.apply(reversed,arguments);},reverse:function reverse(){return reify(this,reverseFactory(this,true));},slice:function slice(begin,end){return reify(this,sliceFactory(this,begin,end,true));},some:function some(predicate,context){return !this.every(not(predicate),context);},sort:function sort(comparator){return reify(this,sortFactory(this,comparator));},values:function values(){return this.__iterator(ITERATE_VALUES);}, // ### More sequential methods
	butLast:function butLast(){return this.slice(0,-1);},isEmpty:function isEmpty(){return this.size !== undefined?this.size === 0:!this.some(function(){return true;});},count:function count(predicate,context){return ensureSize(predicate?this.toSeq().filter(predicate,context):this);},countBy:function countBy(grouper,context){return countByFactory(this,grouper,context);},equals:function equals(other){return deepEqual(this,other);},entrySeq:function entrySeq(){var iterable=this;if(iterable._cache){ // We cache as an entries array, so we can just return the cache!
	return new ArraySeq(iterable._cache);}var entriesSequence=iterable.toSeq().map(entryMapper).toIndexedSeq();entriesSequence.fromEntrySeq = function(){return iterable.toSeq();};return entriesSequence;},filterNot:function filterNot(predicate,context){return this.filter(not(predicate),context);},findEntry:function findEntry(predicate,context,notSetValue){var found=notSetValue;this.__iterate(function(v,k,c){if(predicate.call(context,v,k,c)){found = [k,v];return false;}});return found;},findKey:function findKey(predicate,context){var entry=this.findEntry(predicate,context);return entry && entry[0];},findLast:function findLast(predicate,context,notSetValue){return this.toKeyedSeq().reverse().find(predicate,context,notSetValue);},findLastEntry:function findLastEntry(predicate,context,notSetValue){return this.toKeyedSeq().reverse().findEntry(predicate,context,notSetValue);},findLastKey:function findLastKey(predicate,context){return this.toKeyedSeq().reverse().findKey(predicate,context);},first:function first(){return this.find(returnTrue);},flatMap:function flatMap(mapper,context){return reify(this,flatMapFactory(this,mapper,context));},flatten:function flatten(depth){return reify(this,flattenFactory(this,depth,true));},fromEntrySeq:function fromEntrySeq(){return new FromEntriesSequence(this);},get:function get(searchKey,notSetValue){return this.find(function(_,key){return is(key,searchKey);},undefined,notSetValue);},getIn:function getIn(searchKeyPath,notSetValue){var nested=this; // Note: in an ES6 environment, we would prefer:
	// for (var key of searchKeyPath) {
	var iter=forceIterator(searchKeyPath);var step;while(!(step = iter.next()).done) {var key=step.value;nested = nested && nested.get?nested.get(key,NOT_SET):NOT_SET;if(nested === NOT_SET){return notSetValue;}}return nested;},groupBy:function groupBy(grouper,context){return groupByFactory(this,grouper,context);},has:function has(searchKey){return this.get(searchKey,NOT_SET) !== NOT_SET;},hasIn:function hasIn(searchKeyPath){return this.getIn(searchKeyPath,NOT_SET) !== NOT_SET;},isSubset:function isSubset(iter){iter = typeof iter.includes === 'function'?iter:Iterable(iter);return this.every(function(value){return iter.includes(value);});},isSuperset:function isSuperset(iter){iter = typeof iter.isSubset === 'function'?iter:Iterable(iter);return iter.isSubset(this);},keyOf:function keyOf(searchValue){return this.findKey(function(value){return is(value,searchValue);});},keySeq:function keySeq(){return this.toSeq().map(keyMapper).toIndexedSeq();},last:function last(){return this.toSeq().reverse().first();},lastKeyOf:function lastKeyOf(searchValue){return this.toKeyedSeq().reverse().keyOf(searchValue);},max:function max(comparator){return maxFactory(this,comparator);},maxBy:function maxBy(mapper,comparator){return maxFactory(this,comparator,mapper);},min:function min(comparator){return maxFactory(this,comparator?neg(comparator):defaultNegComparator);},minBy:function minBy(mapper,comparator){return maxFactory(this,comparator?neg(comparator):defaultNegComparator,mapper);},rest:function rest(){return this.slice(1);},skip:function skip(amount){return this.slice(Math.max(0,amount));},skipLast:function skipLast(amount){return reify(this,this.toSeq().reverse().skip(amount).reverse());},skipWhile:function skipWhile(predicate,context){return reify(this,skipWhileFactory(this,predicate,context,true));},skipUntil:function skipUntil(predicate,context){return this.skipWhile(not(predicate),context);},sortBy:function sortBy(mapper,comparator){return reify(this,sortFactory(this,comparator,mapper));},take:function take(amount){return this.slice(0,Math.max(0,amount));},takeLast:function takeLast(amount){return reify(this,this.toSeq().reverse().take(amount).reverse());},takeWhile:function takeWhile(predicate,context){return reify(this,takeWhileFactory(this,predicate,context));},takeUntil:function takeUntil(predicate,context){return this.takeWhile(not(predicate),context);},valueSeq:function valueSeq(){return this.toIndexedSeq();}, // ### Hashable Object
	hashCode:function hashCode(){return this.__hash || (this.__hash = hashIterable(this));} // ### Internal
	// abstract __iterate(fn, reverse)
	// abstract __iterator(type, reverse)
	}); // var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
	// var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
	// var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
	// var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';
	var IterablePrototype=Iterable.prototype;IterablePrototype[IS_ITERABLE_SENTINEL] = true;IterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.values;IterablePrototype.__toJS = IterablePrototype.toArray;IterablePrototype.__toStringMapper = quoteString;IterablePrototype.inspect = IterablePrototype.toSource = function(){return this.toString();};IterablePrototype.chain = IterablePrototype.flatMap;IterablePrototype.contains = IterablePrototype.includes;mixin(KeyedIterable,{ // ### More sequential methods
	flip:function flip(){return reify(this,flipFactory(this));},mapEntries:function mapEntries(mapper,context){var this$0=this;var iterations=0;return reify(this,this.toSeq().map(function(v,k){return mapper.call(context,[k,v],iterations++,this$0);}).fromEntrySeq());},mapKeys:function mapKeys(mapper,context){var this$0=this;return reify(this,this.toSeq().flip().map(function(k,v){return mapper.call(context,k,v,this$0);}).flip());}});var KeyedIterablePrototype=KeyedIterable.prototype;KeyedIterablePrototype[IS_KEYED_SENTINEL] = true;KeyedIterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.entries;KeyedIterablePrototype.__toJS = IterablePrototype.toObject;KeyedIterablePrototype.__toStringMapper = function(v,k){return JSON.stringify(k) + ': ' + quoteString(v);};mixin(IndexedIterable,{ // ### Conversion to other types
	toKeyedSeq:function toKeyedSeq(){return new ToKeyedSequence(this,false);}, // ### ES6 Collection methods (ES6 Array and Map)
	filter:function filter(predicate,context){return reify(this,filterFactory(this,predicate,context,false));},findIndex:function findIndex(predicate,context){var entry=this.findEntry(predicate,context);return entry?entry[0]:-1;},indexOf:function indexOf(searchValue){var key=this.keyOf(searchValue);return key === undefined?-1:key;},lastIndexOf:function lastIndexOf(searchValue){var key=this.lastKeyOf(searchValue);return key === undefined?-1:key;},reverse:function reverse(){return reify(this,reverseFactory(this,false));},slice:function slice(begin,end){return reify(this,sliceFactory(this,begin,end,false));},splice:function splice(index,removeNum /*, ...values*/){var numArgs=arguments.length;removeNum = Math.max(removeNum | 0,0);if(numArgs === 0 || numArgs === 2 && !removeNum){return this;} // If index is negative, it should resolve relative to the size of the
	// collection. However size may be expensive to compute if not cached, so
	// only call count() if the number is in fact negative.
	index = resolveBegin(index,index < 0?this.count():this.size);var spliced=this.slice(0,index);return reify(this,numArgs === 1?spliced:spliced.concat(arrCopy(arguments,2),this.slice(index + removeNum)));}, // ### More collection methods
	findLastIndex:function findLastIndex(predicate,context){var entry=this.findLastEntry(predicate,context);return entry?entry[0]:-1;},first:function first(){return this.get(0);},flatten:function flatten(depth){return reify(this,flattenFactory(this,depth,false));},get:function get(index,notSetValue){index = wrapIndex(this,index);return index < 0 || this.size === Infinity || this.size !== undefined && index > this.size?notSetValue:this.find(function(_,key){return key === index;},undefined,notSetValue);},has:function has(index){index = wrapIndex(this,index);return index >= 0 && (this.size !== undefined?this.size === Infinity || index < this.size:this.indexOf(index) !== -1);},interpose:function interpose(separator){return reify(this,interposeFactory(this,separator));},interleave:function interleave() /*...iterables*/{var iterables=[this].concat(arrCopy(arguments));var zipped=zipWithFactory(this.toSeq(),IndexedSeq.of,iterables);var interleaved=zipped.flatten(true);if(zipped.size){interleaved.size = zipped.size * iterables.length;}return reify(this,interleaved);},keySeq:function keySeq(){return Range(0,this.size);},last:function last(){return this.get(-1);},skipWhile:function skipWhile(predicate,context){return reify(this,skipWhileFactory(this,predicate,context,false));},zip:function zip() /*, ...iterables */{var iterables=[this].concat(arrCopy(arguments));return reify(this,zipWithFactory(this,defaultZipper,iterables));},zipWith:function zipWith(zipper /*, ...iterables */){var iterables=arrCopy(arguments);iterables[0] = this;return reify(this,zipWithFactory(this,zipper,iterables));}});IndexedIterable.prototype[IS_INDEXED_SENTINEL] = true;IndexedIterable.prototype[IS_ORDERED_SENTINEL] = true;mixin(SetIterable,{ // ### ES6 Collection methods (ES6 Array and Map)
	get:function get(value,notSetValue){return this.has(value)?value:notSetValue;},includes:function includes(value){return this.has(value);}, // ### More sequential methods
	keySeq:function keySeq(){return this.valueSeq();}});SetIterable.prototype.has = IterablePrototype.includes;SetIterable.prototype.contains = SetIterable.prototype.includes; // Mixin subclasses
	mixin(KeyedSeq,KeyedIterable.prototype);mixin(IndexedSeq,IndexedIterable.prototype);mixin(SetSeq,SetIterable.prototype);mixin(KeyedCollection,KeyedIterable.prototype);mixin(IndexedCollection,IndexedIterable.prototype);mixin(SetCollection,SetIterable.prototype); // #pragma Helper functions
	function keyMapper(v,k){return k;}function entryMapper(v,k){return [k,v];}function not(predicate){return function(){return !predicate.apply(this,arguments);};}function neg(predicate){return function(){return -predicate.apply(this,arguments);};}function quoteString(value){return typeof value === 'string'?JSON.stringify(value):String(value);}function defaultZipper(){return arrCopy(arguments);}function defaultNegComparator(a,b){return a < b?1:a > b?-1:0;}function hashIterable(iterable){if(iterable.size === Infinity){return 0;}var ordered=isOrdered(iterable);var keyed=isKeyed(iterable);var h=ordered?1:0;var size=iterable.__iterate(keyed?ordered?function(v,k){h = 31 * h + hashMerge(hash(v),hash(k)) | 0;}:function(v,k){h = h + hashMerge(hash(v),hash(k)) | 0;}:ordered?function(v){h = 31 * h + hash(v) | 0;}:function(v){h = h + hash(v) | 0;});return murmurHashOfSize(size,h);}function murmurHashOfSize(size,h){h = imul(h,0xCC9E2D51);h = imul(h << 15 | h >>> -15,0x1B873593);h = imul(h << 13 | h >>> -13,5);h = (h + 0xE6546B64 | 0) ^ size;h = imul(h ^ h >>> 16,0x85EBCA6B);h = imul(h ^ h >>> 13,0xC2B2AE35);h = smi(h ^ h >>> 16);return h;}function hashMerge(a,b){return a ^ b + 0x9E3779B9 + (a << 6) + (a >> 2) | 0; // int
	}var Immutable={Iterable:Iterable,Seq:Seq,Collection:Collection,Map:Map,OrderedMap:OrderedMap,List:List,Stack:Stack,Set:Set,OrderedSet:OrderedSet,Record:Record,Range:Range,Repeat:Repeat,is:is,fromJS:fromJS};return Immutable;});

/***/ },

/***/ 549:
/***/ function(module, exports, __webpack_require__) {

	/**
	 *  Copyright (c) 2014-2015, Facebook, Inc.
	 *  All rights reserved.
	 *
	 *  This source code is licensed under the BSD-style license found in the
	 *  LICENSE file in the root directory of this source tree. An additional grant
	 *  of patent rights can be found in the PATENTS file in the same directory.
	 */

	/**
	 * Cursor is expected to be required in a node or other CommonJS context:
	 *
	 *     var Cursor = require('immutable/contrib/cursor');
	 *
	 * If you wish to use it in the browser, please check out Browserify or WebPack!
	 */

	var Immutable = __webpack_require__(548);
	var Iterable = Immutable.Iterable;
	var Iterator = Iterable.Iterator;
	var Seq = Immutable.Seq;
	var Map = Immutable.Map;
	var Record = Immutable.Record;

	function cursorFrom(rootData, keyPath, onChange) {
	  if (arguments.length === 1) {
	    keyPath = [];
	  } else if (typeof keyPath === 'function') {
	    onChange = keyPath;
	    keyPath = [];
	  } else {
	    keyPath = valToKeyPath(keyPath);
	  }
	  return makeCursor(rootData, keyPath, onChange);
	}

	var KeyedCursorPrototype = Object.create(Seq.Keyed.prototype);
	var IndexedCursorPrototype = Object.create(Seq.Indexed.prototype);

	function KeyedCursor(rootData, keyPath, onChange, size) {
	  this.size = size;
	  this._rootData = rootData;
	  this._keyPath = keyPath;
	  this._onChange = onChange;
	}
	KeyedCursorPrototype.constructor = KeyedCursor;

	function IndexedCursor(rootData, keyPath, onChange, size) {
	  this.size = size;
	  this._rootData = rootData;
	  this._keyPath = keyPath;
	  this._onChange = onChange;
	}
	IndexedCursorPrototype.constructor = IndexedCursor;

	KeyedCursorPrototype.toString = function () {
	  return this.__toString('Cursor {', '}');
	};
	IndexedCursorPrototype.toString = function () {
	  return this.__toString('Cursor [', ']');
	};

	KeyedCursorPrototype.deref = KeyedCursorPrototype.valueOf = IndexedCursorPrototype.deref = IndexedCursorPrototype.valueOf = function (notSetValue) {
	  return this._rootData.getIn(this._keyPath, notSetValue);
	};

	KeyedCursorPrototype.get = IndexedCursorPrototype.get = function (key, notSetValue) {
	  return this.getIn([key], notSetValue);
	};

	KeyedCursorPrototype.getIn = IndexedCursorPrototype.getIn = function (keyPath, notSetValue) {
	  keyPath = listToKeyPath(keyPath);
	  if (keyPath.length === 0) {
	    return this;
	  }
	  var value = this._rootData.getIn(newKeyPath(this._keyPath, keyPath), NOT_SET);
	  return value === NOT_SET ? notSetValue : wrappedValue(this, keyPath, value);
	};

	IndexedCursorPrototype.set = KeyedCursorPrototype.set = function (key, value) {
	  if (arguments.length === 1) {
	    return updateCursor(this, function () {
	      return key;
	    }, []);
	  } else {
	    return updateCursor(this, function (m) {
	      return m.set(key, value);
	    }, [key]);
	  }
	};

	IndexedCursorPrototype.push = function () /* values */{
	  var args = arguments;
	  return updateCursor(this, function (m) {
	    return m.push.apply(m, args);
	  });
	};

	IndexedCursorPrototype.pop = function () {
	  return updateCursor(this, function (m) {
	    return m.pop();
	  });
	};

	IndexedCursorPrototype.unshift = function () /* values */{
	  var args = arguments;
	  return updateCursor(this, function (m) {
	    return m.unshift.apply(m, args);
	  });
	};

	IndexedCursorPrototype.shift = function () {
	  return updateCursor(this, function (m) {
	    return m.shift();
	  });
	};

	IndexedCursorPrototype.setIn = KeyedCursorPrototype.setIn = Map.prototype.setIn;

	KeyedCursorPrototype.remove = KeyedCursorPrototype['delete'] = IndexedCursorPrototype.remove = IndexedCursorPrototype['delete'] = function (key) {
	  return updateCursor(this, function (m) {
	    return m.remove(key);
	  }, [key]);
	};

	IndexedCursorPrototype.removeIn = IndexedCursorPrototype.deleteIn = KeyedCursorPrototype.removeIn = KeyedCursorPrototype.deleteIn = Map.prototype.deleteIn;

	KeyedCursorPrototype.clear = IndexedCursorPrototype.clear = function () {
	  return updateCursor(this, function (m) {
	    return m.clear();
	  });
	};

	IndexedCursorPrototype.update = KeyedCursorPrototype.update = function (keyOrFn, notSetValue, updater) {
	  return arguments.length === 1 ? updateCursor(this, keyOrFn) : this.updateIn([keyOrFn], notSetValue, updater);
	};

	IndexedCursorPrototype.updateIn = KeyedCursorPrototype.updateIn = function (keyPath, notSetValue, updater) {
	  return updateCursor(this, function (m) {
	    return m.updateIn(keyPath, notSetValue, updater);
	  }, keyPath);
	};

	IndexedCursorPrototype.merge = KeyedCursorPrototype.merge = function () /*...iters*/{
	  var args = arguments;
	  return updateCursor(this, function (m) {
	    return m.merge.apply(m, args);
	  });
	};

	IndexedCursorPrototype.mergeWith = KeyedCursorPrototype.mergeWith = function (merger /*, ...iters*/) {
	  var args = arguments;
	  return updateCursor(this, function (m) {
	    return m.mergeWith.apply(m, args);
	  });
	};

	IndexedCursorPrototype.mergeIn = KeyedCursorPrototype.mergeIn = Map.prototype.mergeIn;

	IndexedCursorPrototype.mergeDeep = KeyedCursorPrototype.mergeDeep = function () /*...iters*/{
	  var args = arguments;
	  return updateCursor(this, function (m) {
	    return m.mergeDeep.apply(m, args);
	  });
	};

	IndexedCursorPrototype.mergeDeepWith = KeyedCursorPrototype.mergeDeepWith = function (merger /*, ...iters*/) {
	  var args = arguments;
	  return updateCursor(this, function (m) {
	    return m.mergeDeepWith.apply(m, args);
	  });
	};

	IndexedCursorPrototype.mergeDeepIn = KeyedCursorPrototype.mergeDeepIn = Map.prototype.mergeDeepIn;

	KeyedCursorPrototype.withMutations = IndexedCursorPrototype.withMutations = function (fn) {
	  return updateCursor(this, function (m) {
	    return (m || Map()).withMutations(fn);
	  });
	};

	KeyedCursorPrototype.cursor = IndexedCursorPrototype.cursor = function (subKeyPath) {
	  subKeyPath = valToKeyPath(subKeyPath);
	  return subKeyPath.length === 0 ? this : subCursor(this, subKeyPath);
	};

	/**
	 * All iterables need to implement __iterate
	 */
	KeyedCursorPrototype.__iterate = IndexedCursorPrototype.__iterate = function (fn, reverse) {
	  var cursor = this;
	  var deref = cursor.deref();
	  return deref && deref.__iterate ? deref.__iterate(function (v, k) {
	    return fn(wrappedValue(cursor, [k], v), k, cursor);
	  }, reverse) : 0;
	};

	/**
	 * All iterables need to implement __iterator
	 */
	KeyedCursorPrototype.__iterator = IndexedCursorPrototype.__iterator = function (type, reverse) {
	  var deref = this.deref();
	  var cursor = this;
	  var iterator = deref && deref.__iterator && deref.__iterator(Iterator.ENTRIES, reverse);
	  return new Iterator(function () {
	    if (!iterator) {
	      return { value: undefined, done: true };
	    }
	    var step = iterator.next();
	    if (step.done) {
	      return step;
	    }
	    var entry = step.value;
	    var k = entry[0];
	    var v = wrappedValue(cursor, [k], entry[1]);
	    return {
	      value: type === Iterator.KEYS ? k : type === Iterator.VALUES ? v : [k, v],
	      done: false
	    };
	  });
	};

	KeyedCursor.prototype = KeyedCursorPrototype;
	IndexedCursor.prototype = IndexedCursorPrototype;

	var NOT_SET = {}; // Sentinel value

	function makeCursor(rootData, keyPath, onChange, value) {
	  if (arguments.length < 4) {
	    value = rootData.getIn(keyPath);
	  }
	  var size = value && value.size;
	  var CursorClass = Iterable.isIndexed(value) ? IndexedCursor : KeyedCursor;
	  var cursor = new CursorClass(rootData, keyPath, onChange, size);

	  if (value instanceof Record) {
	    defineRecordProperties(cursor, value);
	  }

	  return cursor;
	}

	function defineRecordProperties(cursor, value) {
	  try {
	    value._keys.forEach(setProp.bind(undefined, cursor));
	  } catch (error) {
	    // Object.defineProperty failed. Probably IE8.
	  }
	}

	function setProp(prototype, name) {
	  Object.defineProperty(prototype, name, {
	    get: function get() {
	      return this.get(name);
	    },
	    set: function set(value) {
	      if (!this.__ownerID) {
	        throw new Error('Cannot set on an immutable record.');
	      }
	    }
	  });
	}

	function wrappedValue(cursor, keyPath, value) {
	  return Iterable.isIterable(value) ? subCursor(cursor, keyPath, value) : value;
	}

	function subCursor(cursor, keyPath, value) {
	  if (arguments.length < 3) {
	    return makeCursor( // call without value
	    cursor._rootData, newKeyPath(cursor._keyPath, keyPath), cursor._onChange);
	  }
	  return makeCursor(cursor._rootData, newKeyPath(cursor._keyPath, keyPath), cursor._onChange, value);
	}

	function updateCursor(cursor, changeFn, changeKeyPath) {
	  var deepChange = arguments.length > 2;
	  var newRootData = cursor._rootData.updateIn(cursor._keyPath, deepChange ? Map() : undefined, changeFn);
	  var keyPath = cursor._keyPath || [];
	  var result = cursor._onChange && cursor._onChange.call(undefined, newRootData, cursor._rootData, deepChange ? newKeyPath(keyPath, changeKeyPath) : keyPath);
	  if (result !== undefined) {
	    newRootData = result;
	  }
	  return makeCursor(newRootData, cursor._keyPath, cursor._onChange);
	}

	function newKeyPath(head, tail) {
	  return head.concat(listToKeyPath(tail));
	}

	function listToKeyPath(list) {
	  return Array.isArray(list) ? list : Immutable.Iterable(list).toArray();
	}

	function valToKeyPath(val) {
	  return Array.isArray(val) ? val : Iterable.isIterable(val) ? val.toArray() : [val];
	}

	exports.from = cursorFrom;

/***/ },

/***/ 550:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Description: iflux内部的工具类
	 */

	/**
	 * 是不是debug状态
	 * 判断是浏览器环境还是node环境，放在在node中测试代码
	 * 以前的方案是在url的后面直接加上debug，即可开启。
	 * 但是这种模式在SPA的应用中华丽丽的挂了，因为SPA的路由多用#来标识
	 * 所以我们要全新设计一套，这次不需要在URL中设置，我们在console中直接动态的改变
	 *
	 * 有个笑话，『当我写代码的时候，我与上帝同在。现在只有上帝知道。』
	 * 那我们就开启我们的上帝模式吧。
	 */
	var IS_DEBUG = false;

	/**
	 * 判断当前的环境
	 */
	var ctx = typeof window === 'undefined' ? process : window;

	/**
	 * 开启上帝模式
	 */
	ctx.god = function () {
	  IS_DEBUG = true;
	  console.log('iflux say:此刻为您开启上帝模式, 完美世界即将开启');
	  return "ok";
	};

	/**
	 * 包装console.log
	 */
	exports.log = function () {
	  IS_DEBUG && console && console.log && console.log.apply(console, arguments);
	};

	/**
	 * 判断是不是数组
	 *
	 * @param arr
	 * @returns {boolean}
	 */
	exports.isArray = function (arr) {
	  return Object.prototype.toString.call(arr) === '[object Array]';
	};

	/**
	 * 获取对象的所有key
	 *
	 * alias Object.keys
	 * @param obj
	 * @returns {Array}
	 */
	exports.keys = function (obj) {
	  var keyArr = [];
	  obj = obj || {};

	  for (var key in obj) {
	    if (obj.hasOwnProperty(key)) {
	      keyArr.push(key);
	    }
	  }

	  return keyArr;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(300)))

/***/ },

/***/ 551:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 随着es2015的发布，我们也要跟着时代的变化，全面进入es6时代
	 * 首先我们要解决的就是react的mixins的问题，因为es6没有对应的概念
	 * 但是，通过高阶函数的wrapper，我们仍可以很优雅的解决这个问题。
	 */
	var React = __webpack_require__(298);
	var assign = __webpack_require__(301);
	var merge = Object.assign || assign;
	var noop = function noop() {};

	//expose
	module.exports = connectToStore;

	/**
	 * connectToStore
	 *
	 * 通过高阶函数的封装使React的view和Immutable的数据层关联起来，并且可以感知到immutable的数据变化
	 * @param store immutable的数据中心
	 * @param reset 是否需要每次初始化的时候重置数据
	 */
	function connectToStore(store, reset) {
	  return function StoreContainer(Component) {
	    //proxy componentDidMount
	    var proxyComponentDidMount = Component.prototype.componentDidMount || noop;
	    //reset
	    Component.prototype.componentDidMount = noop;

	    return React.createClass({
	      displayName: 'StoreProvider',

	      getInitialState: function getInitialState() {
	        //如果设置了重置数据，则在每次init的时候重置store
	        if (reset) {
	          store.reset();
	        }

	        return {
	          data: store.data()
	        };
	      },

	      componentWillMount: function componentWillMount() {
	        this._mounted = false;
	      },

	      componentDidMount: function componentDidMount() {
	        this._mounted = true;
	        store.onStoreChange(this._onIfluxStoreChange);

	        if (proxyComponentDidMount) {
	          proxyComponentDidMount.call(this.App);
	        }
	      },

	      componentWillUpdate: function componentWillUpdate() {
	        this._mounted = false;
	      },

	      componentDidUpdate: function componentDidUpdate() {
	        this._mounted = true;
	      },

	      componentWillUnmount: function componentWillUnmount() {
	        this._mounted = false;
	        store.removeStoreChange(this._onIfluxStoreChange);
	      },

	      render: function render() {
	        var self = this;
	        return React.createElement(Component, merge({}, {
	          ref: function ref(App) {
	            return self.App = App;
	          }
	        }, this.props, { store: this.state.data }));
	      },

	      /**
	       * 监听Store
	       */
	      _onIfluxStoreChange: function _onIfluxStoreChange(nextState, path) {
	        if (this._mounted) {
	          this.setState(function () {
	            return { data: nextState };
	          });
	        }
	      }
	    });
	  };
	}

/***/ },

/***/ 552:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 使用immutable主要为了好还原fieldError
	 */
	var Immutable = __webpack_require__(548);
	var _ = __webpack_require__(550);

	/**
	 * Validator框架
	 *
	 * 思想：
	 *  区别与jQuery validator针对dom进行校验，使用React我们尽量做到和DOM的分离。
	 *  我们不去校验我们的dom数据，而是去校验我们的领域对象也就是我们的store。
	 *  view层(react)只是去展示我们的校验结果罢了。这样我们view和validator解耦
	 *  更清晰的职责划分，另外在validator中获取数据易如反掌。
	 *
	 * 目标：
	 * 1. 校验全部配置的数据
	 * 2. 校验配置数据中的单个数据
	 * 4. 集成iflux的store
	 *
	 * Usage：
	 *
	 * var iflux = require('iflux');
	 *
	 * var store = iflux.Store({
	 *  form: {
	 *    username: '',
	 *    password: '',
	 *    email: ''
	 *  }
	 * });
	 *
	 * var validator = iflux.Validator(store, {
	 *   'form.username': {
	 *      required: true,
	 *      minLength: 4,
	 *      message: {
	 *        required: 'username is required',
	 *        minLength: 'username length great than 4'
	 *
	 *      }
	 *   },
	 *
	 *   'form.password': {
	 *      required: true,
	 *      message: {
	 *        required: 'password is required'
	 *    }
	 *   },
	 *
	 *   'form.email': {
	 *	required: true,
	 *	email: true,
	 *	message: {
	 *	  required: 'email is required',
	 *	  email: 'email is invalid.'
	 *	}
	 *   }
	 * });
	 *
	 * //customize validator
	 * validator.rule('lessThen3', function(val) {
	 *  return val < 3;
	 * });
	 *
	 *
	 * //校验全部
	 * validator.isValid();
	 *
	 * //校验某一个
	 * validator.isValid('username');
	 *
	 * @type {Function}
	 */
	module.exports = Validator;

	/**
	 * 封装我们的Validator对象
	 *
	 * @param store 关联的store
	 * @param rules 关联的规则
	 * @param opts 可选的参数
	 * @constructor
	 */
	function Validator(store, rules, opts) {
	  if (!(this instanceof Validator)) return new Validator(store, rules, opts);

	  //校验参数
	  if (!store || !rules) {
	    throw new Error('store or rules can not empty!');
	  }

	  this.store = store;
	  this.rules = rules;
	  this.opts = opts || {};
	  this.fieldErrors = Immutable.OrderedMap({});

	  /**
	   * 最小化暴露方法
	   */
	  return {
	    isValid: this.isValid.bind(this),
	    rule: this.rule.bind(this),
	    clearError: this.clearError.bind(this),
	    fieldErrors: (function () {
	      return this.fieldErrors.toJS();
	    }).bind(this)
	  };
	}

	/**
	 * 添加自定义的规则
	 *
	 * @param name 规则名称
	 * @param callback 规则函数
	 */
	Validator.prototype.rule = function (name, callback) {
	  this[name] = callback;
	};

	/**
	 * 清空错误信息
	 * @path 要清空的错误信息路径,不传默认清空所有
	 *
	 */
	Validator.prototype.clearError = function (path) {
	  if (path) {
	    // 获取path对应的值
	    var pathArr = path.split("\.");
	    // 根据传入的path清空错误信息
	    this.fieldErrors = this.fieldErrors[_.isArray(pathArr) ? 'removeIn' : 'remove'](pathArr);
	  } else {
	    // 如果没有传path默认清空所有的错误
	    this.fieldErrors = Immutable.OrderedMap({});
	  }
	};

	/**
	 * 判断校验是不是通过
	 *
	 * @param path
	 */
	Validator.prototype.isValid = function (path) {
	  var success = true;

	  var _this = this;
	  var store = this.store;
	  var rules = this.rules;
	  var opts = this.opts;

	  var oneError = opts['oneError'];
	  oneError = oneError !== false;

	  var validate = function validate(path) {
	    var messageInfo = oneError ? '' : [];

	    //获取path对应的校验规则
	    var ruleObj = rules[path];
	    var validatePassTip = ruleObj['message']['success'] || '';

	    //获取path对应的值
	    var pathArr = path.split("\.");
	    //值默认为空字符串
	    var val = store.data()[_.isArray(pathArr) ? 'getIn' : 'get'](pathArr) || '';

	    //遍历所有的规则名称，执行校验方法
	    var ruleNameList = _.keys(ruleObj).filter(function (ruleName) {
	      return ruleName !== 'message';
	    });

	    //校验规则中是否包含必填项，如果没有必填项，当值为空时不校验
	    var isRequired = ruleNameList.indexOf('required') != -1;

	    for (var i = 0, len = ruleNameList.length; i < len; i++) {
	      var ruleName = ruleNameList[i];
	      //校验规则对应的值
	      var ruleValue = ruleObj[ruleName];

	      //log it
	      _.log('\npath:', path, 'ruleName:', ruleName, 'ruleValue:', ruleValue, 'val:', val);

	      //如果不是必填项，当值为空字时，不校验
	      isRequired = isRequired || ruleName.indexOf('Required') != -1;

	      if (ruleName !== 'required' && !isRequired && val === '') {
	        continue;
	      }

	      if (typeof _this[ruleName] === 'undefined') {
	        throw new Error(path + ':' + ruleName + ' can not find.');
	      }

	      //校验结果
	      var result = _this[ruleName](ruleValue, val);

	      //校验没有通过
	      if (!result) {
	        success = false;
	        var validMsg = (ruleObj['message'] || {})[ruleName];
	        if (!validMsg) {
	          _.log('Warning:', path, ' rule: ', ruleName, 'not any message info!');
	        }
	        _.isArray(messageInfo) ? messageInfo.push(validMsg || '') : messageInfo = validMsg || '';

	        //只显示一个错误
	        if (oneError) {
	          break;
	        }
	      }
	    }
	    var retObj = {};
	    if (messageInfo.length) {
	      retObj = {
	        result: false,
	        message: messageInfo
	      };
	    } else {
	      retObj = {
	        result: true,
	        message: validatePassTip
	      };
	    }

	    _this.fieldErrors = _this.fieldErrors[_.isArray(pathArr) ? 'setIn' : 'set'](pathArr, Immutable.fromJS(retObj));
	  };

	  //部分校验
	  if (path != null) {
	    if (rules[path]) {
	      validate(path);
	    } else {
	      throw new Error('can not find match path.');
	    }
	  } else {
	    //全部校验
	    //循环所有的path
	    _.keys(rules).forEach(function (path) {
	      validate(path);
	    });
	  }

	  //如果校验没有通过，设置store的fieldErrors
	  store.cursor().set('fieldErrors', this.fieldErrors);

	  return success;
	};

	//////////////////////////////////////////////////validate method//////////////////////////////////////////////////
	/**
	 *  判断是不是email
	 *
	 * @param param (email: true|false)
	 * @param value (校验的值)
	 * @returns {boolean|*}
	 */
	Validator.prototype.email = function (param, value) {
	  var pass = true;

	  if (param === true) {
	    pass = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
	  }

	  return pass;
	};

	/**
	 * 判断是不是url
	 *
	 * @param param(url:true|false)
	 * @param value
	 * @returns {boolean|*}
	 */
	Validator.prototype.url = function url(param, value) {
	  var pass = true;

	  if (param === true) {
	    pass = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
	  }

	  return pass;
	};

	/**
	 *  校验是不是日期
	 *
	 * @param param
	 * @param value
	 * @returns {boolean}
	 */
	Validator.prototype.date = function (param, value) {
	  var pass = true;

	  if (param === true) {
	    pass = !/Invalid|NaN/.test(new Date(value).toString());
	  }

	  return pass;
	};

	/**
	 * 判断是不是ISO的日期格式
	 *
	 * @param param
	 * @param value
	 * @returns {boolean|*}
	 */
	Validator.prototype.dataISO = function dataISO(param, value) {
	  var pass = true;

	  if (param === true) {
	    pass = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
	  }

	  return pass;
	};

	/**
	 * 判断是不是数字带小数点
	 *
	 * @param param
	 * @param value
	 * @returns {boolean}
	 */
	Validator.prototype.number = function number(param, value) {
	  var result = true;

	  if (param === true) {
	    result = /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
	  }

	  return result;
	};

	/**
	 * 校验是不是数字不带小数点
	 *
	 * @param param
	 * @param value
	 * @returns {boolean|*}
	 */
	Validator.prototype.digits = function digits(param, value) {
	  var pass = true;

	  if (param === true) {
	    pass = /^\d+$/.test(value);
	  }

	  return pass;
	};

	/**
	 * 校验必须项
	 *
	 * @param param
	 * @param value
	 * @returns {boolean}
	 */
	Validator.prototype.required = function required(param, value) {
	  var pass = true;

	  if (pass === true) {
	    return value.length > 0;
	  }

	  return pass;
	};

	/**
	 * 身份证号码
	 *
	 * @param param
	 * @param value
	 * @returns {boolean}
	 */
	Validator.prototype.cardNo = function cardNo(param, value) {
	  var pass = true;

	  if (param === true) {
	    var len = value.length,
	        re;
	    if (len == 15) re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{3})$/);else if (len == 18) re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\d|[Xx])$/);else {
	      return false;
	    }
	    var a = value.match(re);
	    if (a != null) {
	      if (len == 15) {
	        var D = new Date("19" + a[3] + "/" + a[4] + "/" + a[5]);
	        var B = D.getYear() == a[3] && D.getMonth() + 1 == a[4] && D.getDate() == a[5];
	      } else {
	        var D = new Date(a[3] + "/" + a[4] + "/" + a[5]);
	        var B = D.getFullYear() == a[3] && D.getMonth() + 1 == a[4] && D.getDate() == a[5];
	      }
	      if (!B) {
	        return false;
	      }
	    }
	    return true;
	  }

	  return pass;
	};

	/**
	 *
	 * @param param
	 * @param value
	 * @returns {boolean|*}
	 */
	Validator.prototype.qq = function qq(param, value) {
	  var pass = true;

	  if (param === true) {
	    var reg = /^[1-9][0-9]{4,14}$/;
	    pass = reg.test(value);
	  }

	  return pass;
	};

	/**
	 * 手机号码
	 * @param param
	 * @param value
	 * @returns {boolean}
	 */
	Validator.prototype.mobile = function mobile(param, value) {
	  var pass = true;

	  if (param === true) {
	    var length = value.length;
	    var reg = /^((1)+\d{10})$/;
	    pass = length == 11 && reg.test(value);
	  }

	  return pass;
	};

	/**
	 * 电话号码
	 * @param param
	 * @param value
	 * @returns {boolean|*}
	 */
	Validator.prototype.phone = function phone(param, value) {
	  var pass = true;
	  if (param === true) {
	    var reg = /^((\d{10,11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
	    pass = reg.test(value);
	  }

	  return pass;
	};

	/**
	 * 密码强度验证: 密码必须是字符与数字的混合
	 *
	 * @param param
	 * @param value
	 * @returns {boolean}
	 */
	Validator.prototype.pwdMix = function pwdMix(param, value) {
	  var pass = true;

	  if (param === true) {
	    var reg = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;
	    pass = reg.test(value);
	  }

	  return pass;
	};

	/**
	 * 最小值
	 * @param param
	 * @param value
	 * @returns {boolean}
	 */
	Validator.prototype.min = function min(param, value) {
	  return value >= param;
	};

	/**
	 * 最大值
	 * @param param
	 * @param value
	 * @returns {boolean}
	 */
	Validator.prototype.max = function max(param, value) {
	  return value <= param;
	};

	/**
	 * 最小长度
	 *
	 * @param param
	 * @param value
	 * @returns {boolean}
	 */
	Validator.prototype.minLength = function minLength(param, value) {
	  return value.length >= param;
	};

	/**
	 * 最大长度
	 * @param param
	 * @param value
	 * @returns {boolean}
	 */
	Validator.prototype.maxLength = function maxLength(param, value) {
	  return value.length <= param;
	};

	/**
	 * 在范围内
	 *
	 * @param param
	 * @param value
	 * @returns {boolean}
	 */
	Validator.prototype.range = function range(param, value) {
	  return value >= param[0] && value <= param[1];
	};

	/**
	 *  * 长度在范围之内
	 *   *
	 *    * @param param
	 *     * @param val
	 *      * @returns {boolean}
	 *       */
	Validator.prototype.rangeLength = function rangeLength(param, val) {
	  return val.length >= param[0] && val.length <= param[1];
	};

	/**
	 * 非法字符
	 *
	 * @param param
	 * @param value
	 * @returns {boolean}
	 */
	Validator.prototype.forbbidenChar = function forbbidenChar(param, value) {
	  var pass = true;

	  if (param === true) {
	    pass = /[&\\<>'"]/.test(value);
	  }

	  return pass;
	};

	/**
	 * 邮编
	 *
	 * @param param
	 * @param value
	 * @returns {boolean}
	 */
	Validator.prototype.zipCode = function zipCode(param, value) {
	  var pass = true;
	  if (param === true) {
	    pass = /^[0-9]{6}$/.test(value);
	  }
	  return pass;
	};

	/**
	 * 判断是不是数字最多两位小数
	 *
	 * @param param
	 * @param value
	 * @returns {boolean}
	 */
	Validator.prototype.number2point = function number(param, value) {
	  var result = true;

	  if (param === true) {
	    result = /^[0-9]+(.[0-9]{1,2})?$/.test(value);
	  }

	  return result;
	};

/***/ },

/***/ 553:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 使用更简洁的EventEmitter(完全没用dom的影子，只是一个callback队列)作为我们的消息中心
	 *
	 * 在没用使用React之前，使用jQuery使用pubsub的方案对模块进行解耦，不需要借助第三方的插件
	 * 简单的使用jquery自定义事件来做即可。
	 * 比如var msg = $({});
	 *
	 * msg.on('loveYou', function(event, param){});
	 * msg.trigger('loveYou');
	 *
	 * 不好地方，一个pubsub却带有dom的影子会走jQuery的event dispatcher，然后参数的传递不能传递数组类型。
	 *
	 * 主要想简单的使用node EventEmitter模块，其实略感这个模块有点大，其实很可以简化。
	 * 做到一个minievent。
	 */
	var EventEmitter = __webpack_require__(554).EventEmitter;

	var emitter = module.exports = new EventEmitter();

	//infinit max listeners
	emitter.setMaxListeners(0);

/***/ },

/***/ 554:
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function (n) {
	  if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function (type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events) this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	          // At least give some kind of context to the user
	          var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	          err.context = er;
	          throw err;
	        }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler)) return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++) listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function (type, listener) {
	  var m;

	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  if (!this._events) this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function (type, listener) {
	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function (type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type]) return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener || isFunction(list.listener) && list.listener === listener) {
	    delete this._events[type];
	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0) return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function (type) {
	  var key, listeners;

	  if (!this._events) return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function (type) {
	  var ret;
	  if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function (type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function (emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}

/***/ },

/***/ 555:
/***/ function(module, exports) {

	/**
	 * store-mixins
	 *
	 * 自动的把中心数据mixin进入顶层的app
	 * 是的原理非常的简单
	 *
	 * @param store 数据中心store
	 * @param reset 标识是不是需要第一次reset一次,默认true
	 */
	module.exports = function (store, reset) {
	  //如果不传递reset，默认为true
	  if (typeof reset === 'undefined') {
	    reset = true;
	  }

	  return {
	    /**
	     * 初始化状态
	     */
	    getInitialState: function getInitialState() {
	      // 在SPA中，会出现数据保留在最新的状态，而不是初始化状态
	      // 每次加载的时候就恢复到初始状态
	      if (reset) {
	        store.reset();
	      }
	      return store.data();
	    },

	    /**
	     * 当中心的数据发生变化的时候，改变顶层的app的state
	     */
	    componentDidMount: function componentDidMount() {
	      var _this = this;
	      store.onStoreChange(function (nextState, path) {
	        if (_this.isMounted()) {
	          _this.replaceState(nextState);
	        }
	      });
	    }
	  };
	};

/***/ },

/***/ 556:
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(298);

	var _react2 = _interopRequireDefault(_react);

	var _utilCommonInfo = __webpack_require__(557);

	var _utilCommonInfo2 = _interopRequireDefault(_utilCommonInfo);

	/**
	 * 菜单头部
	 */

	var Head = (function (_Component) {
	    _inherits(Head, _Component);

	    function Head() {
	        _classCallCheck(this, Head);

	        _get(Object.getPrototypeOf(Head.prototype), 'constructor', this).apply(this, arguments);
	    }

	    _createClass(Head, [{
	        key: 'componentWillMount',
	        value: function componentWillMount() {}
	    }, {
	        key: 'componentDidMount',
	        value: function componentDidMount() {}
	    }, {
	        key: 'componentDidUpdate',
	        value: function componentDidUpdate() {}
	    }, {
	        key: 'render',
	        value: function render() {
	            var that = this;
	            return _react2['default'].createElement(
	                'div',
	                { className: 'head' },
	                _react2['default'].createElement(
	                    'p',
	                    { className: 'logo', target: '_blank' },
	                    _react2['default'].createElement('img', { width: '55', height: '42', src: '//pic.qianmi.com/ejz/ejz_yun/images/logo.png' })
	                ),
	                _react2['default'].createElement(
	                    'div',
	                    { id: 'headRight', className: 'head-right' },
	                    _react2['default'].createElement(
	                        'ul',
	                        null,
	                        _react2['default'].createElement(
	                            'li',
	                            null,
	                            _react2['default'].createElement(
	                                'p',
	                                { className: 'tx-a', title: '' },
	                                _react2['default'].createElement('img', { className: 'tx-img', width: '35', height: '35', src: '//pic.qianmi.com/ejz/ejz2.0/img/mdygimg.png' }),
	                                _react2['default'].createElement(
	                                    'span',
	                                    { className: 'tx-name' },
	                                    _utilCommonInfo2['default'].getUserInfo().nickName
	                                )
	                            )
	                        )
	                    )
	                )
	            );
	        }
	    }, {
	        key: '_callBack',
	        value: function _callBack() {
	            var that = this;
	            that.props.callBack();
	        }
	    }]);

	    return Head;
	})(_react.Component);

	exports['default'] = Head;
	module.exports = exports['default'];

/***/ },

/***/ 557:
/***/ function(module, exports) {

	/**
	 * Created by 李雪洋 on 2017/5/13.
	 */

	var CommonInfo = function CommonInfo() {};

	//{"userName":"of1727","nickName":"李雪洋","authority":1}
	CommonInfo.getUserInfo = function () {
	  var host = window.location.hostname;
	  return $.parseJSON($.cookie(host + 'userInfo'));
	};

	module.exports = CommonInfo;

/***/ },

/***/ 558:
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(298);

	var _react2 = _interopRequireDefault(_react);

	/**
	 * 菜单左侧
	 */

	var Left = (function (_Component) {
	    _inherits(Left, _Component);

	    function Left() {
	        _classCallCheck(this, Left);

	        _get(Object.getPrototypeOf(Left.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(Left, [{
	        key: "componentWillMount",
	        value: function componentWillMount() {}
	    }, {
	        key: "componentDidMount",
	        value: function componentDidMount() {}
	    }, {
	        key: "componentDidUpdate",
	        value: function componentDidUpdate() {}
	    }, {
	        key: "render",
	        value: function render() {
	            var that = this;
	            var chooseTab = that.props.chooseTab;
	            return _react2["default"].createElement(
	                "div",
	                { className: "slide-left" },
	                _react2["default"].createElement(
	                    "ul",
	                    null,
	                    _react2["default"].createElement(
	                        "li",
	                        { className: chooseTab == "MaintainInfo" ? "active" : "", onClick: that._chooseTab.bind(that, "#/maintainInfo") },
	                        _react2["default"].createElement(
	                            "a",
	                            { href: "javascript:void(0)", title: "开发&维护" },
	                            "开发&维护"
	                        )
	                    ),
	                    _react2["default"].createElement(
	                        "li",
	                        { className: chooseTab == "MyTaskInfo" ? "active" : "", onClick: that._chooseTab.bind(that, "#/myTaskInfo") },
	                        _react2["default"].createElement(
	                            "a",
	                            { href: "javascript:void(0)", title: "我的任务" },
	                            "我的任务"
	                        )
	                    ),
	                    _react2["default"].createElement(
	                        "li",
	                        { className: chooseTab == "TplInfo" ? "active" : "", onClick: that._chooseTab.bind(that, "#/tplInfo") },
	                        _react2["default"].createElement(
	                            "a",
	                            { href: "javascript:void(0)", title: "模板详情" },
	                            "模板详情"
	                        )
	                    )
	                )
	            );
	        }
	    }, {
	        key: "_chooseTab",
	        value: function _chooseTab(url) {
	            window.location.href = url;
	        }
	    }]);

	    return Left;
	})(_react.Component);

	exports["default"] = Left;
	module.exports = exports["default"];

/***/ },

/***/ 559:
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(298);

	var _react2 = _interopRequireDefault(_react);

	/**
	 * 分页组件
	 */

	var Left = (function (_Component) {
	    _inherits(Left, _Component);

	    function Left() {
	        _classCallCheck(this, Left);

	        _get(Object.getPrototypeOf(Left.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(Left, [{
	        key: "componentWillMount",
	        value: function componentWillMount() {}
	    }, {
	        key: "componentDidMount",
	        value: function componentDidMount() {}
	    }, {
	        key: "componentDidUpdate",
	        value: function componentDidUpdate() {}
	    }, {
	        key: "render",
	        value: function render() {
	            var that = this;
	            var pageNum = that.props.pageNum;
	            var totalCount = that.props.totalCount;
	            var pageSize = that.props.pageSize;

	            var totalPageNum = 0;
	            if (totalCount % pageSize > 0) {
	                totalPageNum = parseInt(totalCount / pageSize) + 1;
	            } else {
	                totalPageNum = parseInt(totalCount / pageSize);
	            }

	            var afterNum = [],
	                beforeNum = [];

	            var startPageNum = pageNum;
	            while (startPageNum + 1 <= totalPageNum && afterNum.length < 2) {
	                afterNum.push(startPageNum + 1);
	                startPageNum = startPageNum + 1;
	            }

	            var startPageNum = pageNum;
	            while (startPageNum - 1 >= 1 && beforeNum.length < 2) {
	                beforeNum.push(startPageNum - 1);
	                startPageNum = startPageNum - 1;
	            }

	            var allNumList = [];
	            for (var i = beforeNum.length - 1; i >= 0; i--) {
	                allNumList.push(beforeNum[i]);
	            }
	            allNumList.push(pageNum);
	            for (var i = 0; i <= afterNum.length - 1; i++) {
	                allNumList.push(afterNum[i]);
	            }

	            if (pageNum - allNumList[0] < 2 && allNumList.length < 5) {
	                while (allNumList[0] - 1 >= 1 && allNumList.length < 5) {
	                    allNumList.unshift(allNumList[0] - 1);
	                }
	            }
	            if (allNumList[allNumList.length - 1] - pageNum < 2 && allNumList.length < 5) {
	                while (allNumList[allNumList.length - 1] + 1 <= totalPageNum && allNumList.length < 5) {
	                    allNumList.push(allNumList[allNumList.length - 1] + 1);
	                }
	            }

	            return _react2["default"].createElement(
	                "div",
	                { className: "pages" },
	                _react2["default"].createElement(
	                    "ul",
	                    { className: "pagination" },
	                    pageNum > 1 ? _react2["default"].createElement(
	                        "li",
	                        { onClick: that._callBack.bind(that, pageNum - 1) },
	                        _react2["default"].createElement(
	                            "a",
	                            { href: "javascript:void(0)", "aria-label": "Previous" },
	                            _react2["default"].createElement(
	                                "span",
	                                { "aria-hidden": "true" },
	                                "«"
	                            )
	                        )
	                    ) : "",
	                    that._renderNumList(allNumList, pageNum),
	                    pageNum < totalPageNum ? _react2["default"].createElement(
	                        "li",
	                        { onClick: that._callBack.bind(that, pageNum + 1) },
	                        _react2["default"].createElement(
	                            "a",
	                            { href: "javascript:void(0)", "aria-label": "Next" },
	                            _react2["default"].createElement(
	                                "span",
	                                { "aria-hidden": "true" },
	                                "»"
	                            )
	                        )
	                    ) : ""
	                )
	            );
	        }
	    }, {
	        key: "_renderNumList",
	        value: function _renderNumList(allNumList, pageNum) {
	            var that = this;
	            return allNumList.map(function (e, index) {
	                return _react2["default"].createElement(
	                    "li",
	                    { className: pageNum == e ? "active" : "", key: index, onClick: that._callBack.bind(that, e) },
	                    _react2["default"].createElement(
	                        "a",
	                        { href: "javascript:void(0)" },
	                        e
	                    )
	                );
	            });
	        }
	    }, {
	        key: "_callBack",
	        value: function _callBack(newPageNum) {
	            var that = this;
	            that.props.callBack(newPageNum);
	        }
	    }]);

	    return Left;
	})(_react.Component);

	exports["default"] = Left;
	module.exports = exports["default"];

/***/ },

/***/ 560:
/***/ function(module, exports) {

	/**
	 * Created with of666.
	 * Date: 13-6-7
	 * Time: 下午2:50
	 */
	var DateUtil = function DateUtil() {};

	DateUtil.getDateString = function (date) {
	  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	};

	Date.prototype.format = function (format) {
	  var o = {
	    "M+": this.getMonth() + 1,
	    "d+": this.getDate(),
	    "h+": this.getHours(),
	    "m+": this.getMinutes(),
	    "s+": this.getSeconds(),
	    "q+": Math.floor((this.getMonth() + 3) / 3),
	    "S": this.getMilliseconds()
	  };
	  if (/(y+)/.test(format)) {
	    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	  }
	  for (var k in o) {
	    if (new RegExp("(" + k + ")").test(format)) {
	      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	    }
	  }
	  return format;
	};

	Date.prototype.addDays = function (d) {
	  this.setDate(this.getDate() + d);
	};

	Date.prototype.addWeeks = function (w) {
	  this.addDays(w * 7);
	};

	Date.prototype.addMonths = function (m) {
	  var d = this.getDate();
	  this.setMonth(this.getMonth() + m);
	  //if (this.getDate() < d)
	  //  this.setDate(0);
	};

	module.exports = DateUtil;

/***/ },

/***/ 561:
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(298);

	var _react2 = _interopRequireDefault(_react);

	/**
	 * 删除二次确认
	 */

	var Confirm = (function (_Component) {
	    _inherits(Confirm, _Component);

	    function Confirm() {
	        _classCallCheck(this, Confirm);

	        _get(Object.getPrototypeOf(Confirm.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(Confirm, [{
	        key: "componentWillMount",
	        value: function componentWillMount() {}
	    }, {
	        key: "componentDidMount",
	        value: function componentDidMount() {}
	    }, {
	        key: "componentDidUpdate",
	        value: function componentDidUpdate() {}
	    }, {
	        key: "render",
	        value: function render() {
	            var that = this;

	            return _react2["default"].createElement(
	                "div",
	                { className: "modal fade alertSecondSure", id: that.props.id, tabIndex: "-1", role: "dialog" },
	                _react2["default"].createElement(
	                    "div",
	                    { className: "modal-dialog", role: "document" },
	                    _react2["default"].createElement(
	                        "div",
	                        { className: "modal-content" },
	                        _react2["default"].createElement(
	                            "div",
	                            { className: "modal-body" },
	                            _react2["default"].createElement(
	                                "h4",
	                                null,
	                                that.props.title
	                            ),
	                            _react2["default"].createElement(
	                                "p",
	                                { className: "btn-del" },
	                                _react2["default"].createElement(
	                                    "a",
	                                    { className: "btn-delY", "data-dismiss": "modal", onClick: that._callBack.bind(that) },
	                                    that.props.text
	                                ),
	                                _react2["default"].createElement(
	                                    "a",
	                                    { className: "btn-delN", "data-dismiss": "modal", onClick: that._cancelCallBack.bind(that) },
	                                    "取消"
	                                )
	                            )
	                        )
	                    )
	                )
	            );
	        }
	    }, {
	        key: "_callBack",
	        value: function _callBack() {
	            var that = this;

	            if (that.props.callBack) {
	                that.props.callBack();
	            }
	        }
	    }, {
	        key: "_cancelCallBack",
	        value: function _cancelCallBack() {
	            var that = this;

	            if (that.props.cancelCallBack) {
	                that.props.cancelCallBack();
	            }
	        }
	    }]);

	    return Confirm;
	})(_react.Component);

	exports["default"] = Confirm;
	module.exports = exports["default"];

/***/ },

/***/ 563:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * ajax get
	 * @param url
	 * @param data
	 * @param _context
	 * @returns {*}
	 */
	'useStrict';

	var immutable = __webpack_require__(548);
	var request = function request() {};
	module.exports = request;

	request.get = function (url, data, _context) {
	    var deferred = $.Deferred();

	    var ctx = _context || this;

	    var params = data || {};

	    $.ajax({
	        url: url,
	        type: "GET",
	        data: params,
	        success: function success(resp) {
	            resp.result === "ok" ? deferred.resolveWith(ctx, [resp.data]) : deferred.rejectWith(ctx, [resp]);
	        },
	        error: function error(resq) {
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
	request.ajax = function (url, data, _context) {
	    var deferred = $.Deferred();
	    if (!requestControl(data, url)) {
	        return deferred.promise();
	    }

	    var ctx = _context || this;

	    var params = data || {};

	    $.ajax({
	        url: url,
	        type: "GET",
	        data: params,
	        success: function success(resp) {
	            resp.result === "ok" ? deferred.resolveWith(ctx, [resp.data]) : deferred.rejectWith(ctx, [resp]);
	        },
	        error: function error(resq) {
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
	request.post = function (url, data, _context, _config) {
	    var deferred = $.Deferred();
	    if (!requestControl(data, url)) {
	        return deferred.promise();
	    }

	    var ctx = _context || this;
	    var params = data || {};

	    var _option = {
	        url: url,
	        type: "POST",
	        data: params,
	        success: function success(resp) {
	            resp.result === "ok" ? deferred.resolveWith(ctx, [resp.data]) : deferred.rejectWith(ctx, [resp]);
	        },
	        error: function error(resq) {
	            deferred.rejectWith(ctx, [resq]);
	        }
	    };
	    for (var key in _config) {
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
	request.put = function (url, data, _context) {
	    var deferred = $.Deferred();
	    if (!requestControl(data, url)) {
	        return deferred.promise();
	    }

	    var ctx = _context || this;
	    var params = data || {};

	    $.ajax({
	        url: url,
	        type: "PUT",
	        data: params,
	        success: function success(resp) {
	            resp.result === "ok" ? deferred.resolveWith(ctx, [resp.data]) : deferred.rejectWith(ctx, [resp]);
	        },
	        error: function error(resq) {
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
	request['delete'] = function (url, data, _context) {
	    var deferred = $.Deferred();
	    if (!requestControl(data, url)) {
	        return deferred.promise();
	    }

	    var ctx = _context || this;
	    var params = data || {};

	    $.ajax({
	        url: url,
	        type: "DELETE",
	        data: params,
	        success: function success(resp) {
	            resp.result === "ok" ? deferred.resolveWith(ctx, [resp.data]) : deferred.rejectWith(ctx, [resp]);
	        },
	        error: function error(resq) {
	            deferred.rejectWith(ctx, [resq]);
	        }
	    });

	    return deferred.promise();
	};

	/**
	 * 请求处理器，1秒内仅允许一次请求*/
	var arr = new Array();
	var t = 1000; //同一请求1秒内只允许一次
	function requestControl(params, url) {
	    var obj = immutable.fromJS({ params: params, url: url });
	    var _index = arr.length;
	    for (var _i in arr) {
	        if (immutable.is(arr[_i].target, obj)) {
	            var times = arr[_i].times;
	            if (new Date().getTime() - times >= t) {
	                _index = _i;
	                break;
	            } else {
	                arr = arr.splice(_i, _index - _i);
	                return false; //停止此次请求
	            }
	        }
	    }
	    arr[_index] = { times: new Date().getTime(), target: obj };
	    return true;
	}

/***/ },

/***/ 566:
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Created by 李雪洋 on 2017/5/19.
	 */

	var _react = __webpack_require__(298);

	var _react2 = _interopRequireDefault(_react);

	var _iflux = __webpack_require__(546);

	var _reactRouter = __webpack_require__(479);

	var _componentHead = __webpack_require__(556);

	var _componentHead2 = _interopRequireDefault(_componentHead);

	var _componentLeft = __webpack_require__(558);

	var _componentLeft2 = _interopRequireDefault(_componentLeft);

	var _utilCommonInfo = __webpack_require__(557);

	var _utilCommonInfo2 = _interopRequireDefault(_utilCommonInfo);

	var _componentPaging = __webpack_require__(559);

	var _componentPaging2 = _interopRequireDefault(_componentPaging);

	var _utilDateUtil = __webpack_require__(560);

	var _utilDateUtil2 = _interopRequireDefault(_utilDateUtil);

	var _componentConfirm = __webpack_require__(561);

	var _componentConfirm2 = _interopRequireDefault(_componentConfirm);

	var _store = __webpack_require__(567);

	var _store2 = _interopRequireDefault(_store);

	var TplInfo = (function (_React$Component) {
	    _inherits(TplInfo, _React$Component);

	    function TplInfo() {
	        _classCallCheck(this, TplInfo);

	        _get(Object.getPrototypeOf(TplInfo.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(TplInfo, [{
	        key: "componentWillMount",
	        value: function componentWillMount() {
	            _iflux.msg.emit('TplInfo:queryList');
	            _iflux.msg.emit('TplInfo:queryUserList');
	        }
	    }, {
	        key: "componentDidMount",
	        value: function componentDidMount() {}
	    }, {
	        key: "componentDidUpdate",
	        value: function componentDidUpdate() {}
	    }, {
	        key: "render",
	        value: function render() {
	            var that = this;
	            return _react2["default"].createElement(
	                "div",
	                null,
	                _react2["default"].createElement(_componentHead2["default"], null),
	                _react2["default"].createElement(
	                    "div",
	                    { className: "contain" },
	                    _react2["default"].createElement(_componentLeft2["default"], { chooseTab: _store2["default"].data().get("chooseTab") }),
	                    _react2["default"].createElement(
	                        "div",
	                        { className: "right-content" },
	                        _react2["default"].createElement(
	                            "h3",
	                            null,
	                            "模板详情"
	                        ),
	                        _react2["default"].createElement(
	                            "div",
	                            { className: "content" },
	                            _react2["default"].createElement(
	                                "ul",
	                                { className: "tab-li" },
	                                _react2["default"].createElement(
	                                    "li",
	                                    null,
	                                    _react2["default"].createElement(
	                                        "a",
	                                        { href: "javascript:void(0)", title: "模板资源信息记录" },
	                                        "模板资源信息记录"
	                                    )
	                                ),
	                                _utilCommonInfo2["default"].getUserInfo().authority < 3 ? _react2["default"].createElement(
	                                    "a",
	                                    { className: "pull-right btn btn-sm btn-primary", onClick: that._addTplInfo.bind(that) },
	                                    "新增模板详情"
	                                ) : ""
	                            ),
	                            _react2["default"].createElement(
	                                "div",
	                                { className: "search" },
	                                _react2["default"].createElement(
	                                    "table",
	                                    null,
	                                    _react2["default"].createElement(
	                                        "div",
	                                        { className: "search-cont" },
	                                        _react2["default"].createElement(
	                                            "td",
	                                            null,
	                                            _react2["default"].createElement(
	                                                "div",
	                                                { className: "search-left" },
	                                                "模板编号："
	                                            ),
	                                            _react2["default"].createElement(
	                                                "div",
	                                                { className: "search-right" },
	                                                _react2["default"].createElement(
	                                                    "label",
	                                                    { className: "input-icon" },
	                                                    _react2["default"].createElement("input", { placeholder: "模板编号", className: "form-input", type: "text", value: _store2["default"].data().getIn(['chooseForm', 'tpl_id']), onChange: that._change_tpl_Id })
	                                                )
	                                            )
	                                        ),
	                                        _react2["default"].createElement(
	                                            "td",
	                                            null,
	                                            _react2["default"].createElement(
	                                                "div",
	                                                { className: "search-left" },
	                                                "模板类型："
	                                            ),
	                                            _react2["default"].createElement(
	                                                "div",
	                                                { className: "search-right" },
	                                                _react2["default"].createElement(
	                                                    "select",
	                                                    { name: "", className: "form-input", onChange: that._change_cx_or_cz.bind(that) },
	                                                    _react2["default"].createElement(
	                                                        "option",
	                                                        { value: "0", selected: _store2["default"].data().getIn(['chooseForm', 'cx_or_cz']) == 0 ? "selected" : "" },
	                                                        "--------请选择--------"
	                                                    ),
	                                                    _react2["default"].createElement(
	                                                        "option",
	                                                        { value: "1", selected: _store2["default"].data().getIn(['chooseForm', 'cx_or_cz']) == 1 ? "selected" : "" },
	                                                        "查询"
	                                                    ),
	                                                    _react2["default"].createElement(
	                                                        "option",
	                                                        { value: "2", selected: _store2["default"].data().getIn(['chooseForm', 'cx_or_cz']) == 2 ? "selected" : "" },
	                                                        "充值"
	                                                    )
	                                                )
	                                            )
	                                        ),
	                                        _react2["default"].createElement(
	                                            "td",
	                                            null,
	                                            _react2["default"].createElement(
	                                                "div",
	                                                { className: "search-left" },
	                                                "开发人："
	                                            ),
	                                            _react2["default"].createElement(
	                                                "div",
	                                                { className: "search-right" },
	                                                _react2["default"].createElement(
	                                                    "select",
	                                                    { name: "", className: "form-input", onChange: that._change_execute_name.bind(that) },
	                                                    _react2["default"].createElement(
	                                                        "option",
	                                                        { value: "", selected: _store2["default"].data().getIn(['chooseForm', 'execute_name']) == "0" ? "selected" : "" },
	                                                        "--------请选择--------"
	                                                    ),
	                                                    that._renderChangeExecuteNameList()
	                                                )
	                                            )
	                                        )
	                                    ),
	                                    _react2["default"].createElement(
	                                        "div",
	                                        { className: "search-cont" },
	                                        _react2["default"].createElement(
	                                            "td",
	                                            null,
	                                            _react2["default"].createElement(
	                                                "div",
	                                                { className: "search-left" },
	                                                "模板名称："
	                                            ),
	                                            _react2["default"].createElement(
	                                                "div",
	                                                { className: "search-right" },
	                                                _react2["default"].createElement(
	                                                    "label",
	                                                    { className: "input-icon" },
	                                                    _react2["default"].createElement("input", { placeholder: "模板名称", className: "form-input", type: "text", value: _store2["default"].data().getIn(['chooseForm', 'tpl_name']), onChange: that._change_tpl_name })
	                                                )
	                                            )
	                                        ),
	                                        _react2["default"].createElement(
	                                            "td",
	                                            null,
	                                            _react2["default"].createElement(
	                                                "div",
	                                                { className: "search-left" },
	                                                "模板范围："
	                                            ),
	                                            _react2["default"].createElement(
	                                                "div",
	                                                { className: "search-right" },
	                                                _react2["default"].createElement(
	                                                    "select",
	                                                    { name: "", className: "form-input", onChange: that._change_hf_or_sdm.bind(that) },
	                                                    _react2["default"].createElement(
	                                                        "option",
	                                                        { value: "0", selected: _store2["default"].data().getIn(['chooseForm', 'hf_or_sdm']) == "0" ? "selected" : "" },
	                                                        "--------请选择--------"
	                                                    ),
	                                                    _react2["default"].createElement(
	                                                        "option",
	                                                        { value: "1", selected: _store2["default"].data().getIn(['chooseForm', 'hf_or_sdm']) == "1" ? "selected" : "" },
	                                                        "话费"
	                                                    ),
	                                                    _react2["default"].createElement(
	                                                        "option",
	                                                        { value: "2", selected: _store2["default"].data().getIn(['chooseForm', 'hf_or_sdm']) == "2" ? "selected" : "" },
	                                                        "公共事业"
	                                                    ),
	                                                    _react2["default"].createElement(
	                                                        "option",
	                                                        { value: "3", selected: _store2["default"].data().getIn(['chooseForm', 'hf_or_sdm']) == "3" ? "selected" : "" },
	                                                        "综合"
	                                                    )
	                                                )
	                                            )
	                                        ),
	                                        _react2["default"].createElement(
	                                            "td",
	                                            null,
	                                            _react2["default"].createElement(
	                                                "div",
	                                                { className: "search-left" },
	                                                "资源网址："
	                                            ),
	                                            _react2["default"].createElement(
	                                                "div",
	                                                { className: "search-right" },
	                                                _react2["default"].createElement(
	                                                    "label",
	                                                    { className: "input-icon" },
	                                                    _react2["default"].createElement("input", { placeholder: "创建时间", className: "form-input", type: "text" })
	                                                )
	                                            )
	                                        )
	                                    ),
	                                    _react2["default"].createElement(
	                                        "div",
	                                        { className: "search-cont" },
	                                        _react2["default"].createElement(
	                                            "a",
	                                            { className: "btn btn-sm btn-primary", onClick: that._searchList.bind(that) },
	                                            "搜索"
	                                        ),
	                                        "   ",
	                                        _react2["default"].createElement(
	                                            "a",
	                                            { className: "btn btn-sm", style: { backgroundColor: "gray", color: "white" }, onClick: that._resetChooseForm.bind(that) },
	                                            "重置"
	                                        )
	                                    )
	                                )
	                            ),
	                            _react2["default"].createElement(
	                                "div",
	                                { className: "table-cont" },
	                                _react2["default"].createElement(
	                                    "table",
	                                    null,
	                                    _react2["default"].createElement(
	                                        "thead",
	                                        null,
	                                        _react2["default"].createElement(
	                                            "tr",
	                                            null,
	                                            _react2["default"].createElement(
	                                                "th",
	                                                { className: "text-left fans" },
	                                                "模板编号"
	                                            ),
	                                            _react2["default"].createElement(
	                                                "th",
	                                                null,
	                                                "名称"
	                                            ),
	                                            _react2["default"].createElement(
	                                                "th",
	                                                null,
	                                                "资源平台"
	                                            ),
	                                            _react2["default"].createElement(
	                                                "th",
	                                                null,
	                                                "查询/充值"
	                                            ),
	                                            _react2["default"].createElement(
	                                                "th",
	                                                null,
	                                                "话费/水电煤"
	                                            ),
	                                            _react2["default"].createElement(
	                                                "th",
	                                                null,
	                                                "空充类型"
	                                            ),
	                                            _react2["default"].createElement(
	                                                "th",
	                                                null,
	                                                "开发人"
	                                            ),
	                                            _react2["default"].createElement(
	                                                "th",
	                                                null,
	                                                "链接地址"
	                                            ),
	                                            _react2["default"].createElement(
	                                                "th",
	                                                null,
	                                                "最近更新时间"
	                                            ),
	                                            _react2["default"].createElement(
	                                                "th",
	                                                null,
	                                                "资源详情"
	                                            )
	                                        )
	                                    ),
	                                    _react2["default"].createElement(
	                                        "tbody",
	                                        null,
	                                        that._renderTplInfoList()
	                                    )
	                                )
	                            ),
	                            _react2["default"].createElement(_componentPaging2["default"], { pageNum: _store2["default"].data().getIn(['tplData', 'pageNum']), totalCount: _store2["default"].data().getIn(['tplData', 'totalCount']), pageSize: _store2["default"].data().getIn(['tplData', 'pageSize']), callBack: that._changePage }),
	                            _react2["default"].createElement(
	                                "div",
	                                { className: "modal fade alertEditTextPic", id: "alertEditTextPic", tabIndex: "-1", role: "dialog" },
	                                _react2["default"].createElement(
	                                    "div",
	                                    { className: "modal-dialog", role: "document" },
	                                    _react2["default"].createElement(
	                                        "div",
	                                        { className: "modal-content" },
	                                        _react2["default"].createElement(
	                                            "div",
	                                            { className: "modal-header" },
	                                            _react2["default"].createElement(
	                                                "button",
	                                                { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
	                                                _react2["default"].createElement(
	                                                    "span",
	                                                    { "aria-hidden": "true" },
	                                                    "×"
	                                                )
	                                            ),
	                                            _react2["default"].createElement(
	                                                "h4",
	                                                { className: "modal-title" },
	                                                "新增详情"
	                                            )
	                                        ),
	                                        _react2["default"].createElement(
	                                            "div",
	                                            { className: "modal-body" },
	                                            _react2["default"].createElement(
	                                                "ul",
	                                                null,
	                                                _react2["default"].createElement(
	                                                    "li",
	                                                    null,
	                                                    _react2["default"].createElement(
	                                                        "div",
	                                                        { className: "inline" },
	                                                        _react2["default"].createElement(
	                                                            "h5",
	                                                            null,
	                                                            "模板编号"
	                                                        ),
	                                                        _react2["default"].createElement("input", { type: "text", placeholder: "模板编号", value: _store2["default"].data().get("tpl_id"), onChange: that._changeTplId })
	                                                    )
	                                                ),
	                                                _react2["default"].createElement(
	                                                    "li",
	                                                    null,
	                                                    _react2["default"].createElement(
	                                                        "div",
	                                                        { className: "inline" },
	                                                        _react2["default"].createElement(
	                                                            "h5",
	                                                            null,
	                                                            "模板名称"
	                                                        ),
	                                                        _react2["default"].createElement("input", { type: "text", placeholder: "模板名称", value: _store2["default"].data().get("tpl_name"), onChange: that._changeTplName })
	                                                    )
	                                                ),
	                                                _react2["default"].createElement(
	                                                    "li",
	                                                    null,
	                                                    _react2["default"].createElement(
	                                                        "div",
	                                                        { className: "inline labelBlock" },
	                                                        _react2["default"].createElement(
	                                                            "h5",
	                                                            null,
	                                                            "资源平台"
	                                                        ),
	                                                        _react2["default"].createElement(
	                                                            "label",
	                                                            { className: "radio-class" },
	                                                            _react2["default"].createElement("input", { type: "radio", checked: _store2["default"].data().get("wy_or_jk") == 1 ? "checked" : "", onClick: that._changeRadio.bind(that, 'wy_or_jk', 1) }),
	                                                            _react2["default"].createElement(
	                                                                "span",
	                                                                null,
	                                                                "网页"
	                                                            )
	                                                        ),
	                                                        _react2["default"].createElement(
	                                                            "label",
	                                                            { className: "radio-class" },
	                                                            _react2["default"].createElement("input", { type: "radio", checked: _store2["default"].data().get("wy_or_jk") == 2 ? "checked" : "", onClick: that._changeRadio.bind(that, 'wy_or_jk', 2) }),
	                                                            _react2["default"].createElement(
	                                                                "span",
	                                                                null,
	                                                                "接口"
	                                                            )
	                                                        ),
	                                                        _react2["default"].createElement(
	                                                            "label",
	                                                            { className: "radio-class" },
	                                                            _react2["default"].createElement("input", { type: "radio", checked: _store2["default"].data().get("wy_or_jk") == 3 ? "checked" : "", onClick: that._changeRadio.bind(that, 'wy_or_jk', 3) }),
	                                                            _react2["default"].createElement(
	                                                                "span",
	                                                                null,
	                                                                "空充"
	                                                            )
	                                                        )
	                                                    )
	                                                ),
	                                                _react2["default"].createElement(
	                                                    "li",
	                                                    null,
	                                                    _react2["default"].createElement(
	                                                        "div",
	                                                        { className: "inline labelBlock" },
	                                                        _react2["default"].createElement(
	                                                            "h5",
	                                                            null,
	                                                            "查询/充值"
	                                                        ),
	                                                        _react2["default"].createElement(
	                                                            "label",
	                                                            { className: "radio-class" },
	                                                            _react2["default"].createElement("input", { type: "radio", checked: _store2["default"].data().get("cx_or_cz") == 1 ? "checked" : "", onClick: that._changeRadio.bind(that, 'cx_or_cz', 1) }),
	                                                            _react2["default"].createElement(
	                                                                "span",
	                                                                null,
	                                                                "查询"
	                                                            )
	                                                        ),
	                                                        _react2["default"].createElement(
	                                                            "label",
	                                                            { className: "radio-class" },
	                                                            _react2["default"].createElement("input", { type: "radio", checked: _store2["default"].data().get("cx_or_cz") == 2 ? "checked" : "", onClick: that._changeRadio.bind(that, 'cx_or_cz', 2) }),
	                                                            _react2["default"].createElement(
	                                                                "span",
	                                                                null,
	                                                                "充值"
	                                                            )
	                                                        )
	                                                    )
	                                                ),
	                                                _store2["default"].data().get("wy_or_jk") == 3 ? _react2["default"].createElement(
	                                                    "li",
	                                                    null,
	                                                    _react2["default"].createElement(
	                                                        "div",
	                                                        { className: "inline labelBlock" },
	                                                        _react2["default"].createElement(
	                                                            "h5",
	                                                            null,
	                                                            "空充类型"
	                                                        ),
	                                                        _react2["default"].createElement(
	                                                            "label",
	                                                            { className: "radio-class" },
	                                                            _react2["default"].createElement("input", { type: "radio", checked: _store2["default"].data().get("kzcz_type") == 1 ? "checked" : "", onClick: that._changeRadio.bind(that, 'kzcz_type', 1) }),
	                                                            _react2["default"].createElement(
	                                                                "span",
	                                                                null,
	                                                                "短信"
	                                                            )
	                                                        ),
	                                                        _react2["default"].createElement(
	                                                            "label",
	                                                            { className: "radio-class" },
	                                                            _react2["default"].createElement("input", { type: "radio", checked: _store2["default"].data().get("kzcz_type") == 2 ? "checked" : "", onClick: that._changeRadio.bind(that, 'kzcz_type', 2) }),
	                                                            _react2["default"].createElement(
	                                                                "span",
	                                                                null,
	                                                                "拨号"
	                                                            )
	                                                        ),
	                                                        _react2["default"].createElement(
	                                                            "label",
	                                                            { className: "radio-class" },
	                                                            _react2["default"].createElement("input", { type: "radio", checked: _store2["default"].data().get("kzcz_type") == 3 ? "checked" : "", onClick: that._changeRadio.bind(that, 'kzcz_type', 3) }),
	                                                            _react2["default"].createElement(
	                                                                "span",
	                                                                null,
	                                                                "STK"
	                                                            )
	                                                        )
	                                                    )
	                                                ) : "",
	                                                _react2["default"].createElement(
	                                                    "li",
	                                                    null,
	                                                    _react2["default"].createElement(
	                                                        "div",
	                                                        { className: "inline" },
	                                                        _react2["default"].createElement(
	                                                            "h5",
	                                                            null,
	                                                            "资源网站"
	                                                        ),
	                                                        _react2["default"].createElement("input", { type: "text", placeholder: "资源网站", value: _store2["default"].data().get("link"), onChange: that._changeLink })
	                                                    )
	                                                ),
	                                                _react2["default"].createElement(
	                                                    "li",
	                                                    null,
	                                                    _react2["default"].createElement(
	                                                        "div",
	                                                        { className: "inline" },
	                                                        _react2["default"].createElement(
	                                                            "h5",
	                                                            null,
	                                                            "模板归属"
	                                                        ),
	                                                        _react2["default"].createElement(
	                                                            "select",
	                                                            { name: "", onChange: that._changeExecuteName },
	                                                            _react2["default"].createElement(
	                                                                "option",
	                                                                { value: "", selected: _store2["default"].data().get("execute_name") == "" ? "selected" : "" },
	                                                                "--------请选择--------"
	                                                            ),
	                                                            that._renderExecuteNameList()
	                                                        )
	                                                    )
	                                                )
	                                            ),
	                                            _react2["default"].createElement(
	                                                "div",
	                                                { className: "ctt sentCtt" },
	                                                _react2["default"].createElement(
	                                                    "h4",
	                                                    null,
	                                                    _react2["default"].createElement(
	                                                        "a",
	                                                        { href: "javascript:void(0);", onClick: that._changeTabType.bind(that, "text"), className: _store2["default"].data().get("chooseTabType") == "text" ? "text active" : "text" },
	                                                        "文字"
	                                                    ),
	                                                    _react2["default"].createElement(
	                                                        "a",
	                                                        { href: "javascript:void(0);", onClick: that._changeTabType.bind(that, "pic"), className: _store2["default"].data().get("chooseTabType") == "pic" ? "pic active" : "pic" },
	                                                        "图片"
	                                                    )
	                                                ),
	                                                _store2["default"].data().get("chooseTabType") == "text" ? _react2["default"].createElement(
	                                                    "div",
	                                                    { className: "modal-text" },
	                                                    _react2["default"].createElement(
	                                                        "div",
	                                                        { className: "modal-body" },
	                                                        _react2["default"].createElement(
	                                                            "div",
	                                                            { className: "pull-new" },
	                                                            _react2["default"].createElement(
	                                                                "div",
	                                                                { className: "pull-new-body" },
	                                                                _react2["default"].createElement("textarea", { className: "form-input", name: "", id: "", cols: "30", rows: "10", value: _store2["default"].data().get("tpl_content"), onChange: that._changeTplContent })
	                                                            ),
	                                                            _react2["default"].createElement(
	                                                                "div",
	                                                                { className: "pull-new-foot" },
	                                                                _react2["default"].createElement(
	                                                                    "div",
	                                                                    { className: "foot-right" },
	                                                                    _react2["default"].createElement(
	                                                                        "p",
	                                                                        null,
	                                                                        "还可以输入" + (300 - _store2["default"].data().get("tpl_content").length) + "字，按下Enter键换行"
	                                                                    )
	                                                                )
	                                                            )
	                                                        )
	                                                    )
	                                                ) : "",
	                                                _store2["default"].data().get("chooseTabType") == "pic" ? _react2["default"].createElement(
	                                                    "div",
	                                                    { className: "pd choose" },
	                                                    _react2["default"].createElement(
	                                                        "p",
	                                                        { className: "upload" },
	                                                        _react2["default"].createElement(
	                                                            "a",
	                                                            { href: "javascript:void(0);", title: "上传图片" },
	                                                            _react2["default"].createElement(
	                                                                "span",
	                                                                null,
	                                                                "添加图片"
	                                                            ),
	                                                            _react2["default"].createElement("br", null),
	                                                            _react2["default"].createElement("i", { className: "iconfont icon-plus" })
	                                                        ),
	                                                        _react2["default"].createElement("input", { type: "file", accept: "image/png,image/gif,image/jpeg,image/bmp,image/jpg", name: "fileUpload" })
	                                                    )
	                                                ) : ""
	                                            ),
	                                            _react2["default"].createElement(
	                                                "a",
	                                                { className: "btn-bg ensure", onClick: that._saveTask.bind(that), "data-dismiss": "modal", "aria-label": "Close" },
	                                                "确定"
	                                            )
	                                        )
	                                    )
	                                )
	                            )
	                        )
	                    )
	                )
	            );
	        }
	    }, {
	        key: "_renderTplInfoList",
	        value: function _renderTplInfoList() {
	            var that = this;
	            if (_store2["default"].data().getIn(['tplData', 'dataList']).toJS() != null) {
	                return _store2["default"].data().getIn(['tplData', 'dataList']).toJS().map(function (item, index) {
	                    return _react2["default"].createElement(
	                        "tr",
	                        { key: index },
	                        _react2["default"].createElement(
	                            "td",
	                            null,
	                            item.tpl_id
	                        ),
	                        _react2["default"].createElement(
	                            "td",
	                            null,
	                            item.tpl_name
	                        ),
	                        _react2["default"].createElement(
	                            "td",
	                            null,
	                            item.wy_or_jk == 1 ? "网页" : item.wy_or_jk == 2 ? "接口" : "空充"
	                        ),
	                        _react2["default"].createElement(
	                            "td",
	                            null,
	                            item.cx_or_cz == 1 ? "查询" : "充值"
	                        ),
	                        _react2["default"].createElement(
	                            "td",
	                            null,
	                            item.hf_or_sdm == 1 ? "话费" : item.hf_or_sdm == 2 ? "公共事业" : "综合"
	                        ),
	                        _react2["default"].createElement(
	                            "td",
	                            null,
	                            item.kzcz_type == 1 ? "短信" : item.kzcz_type == 2 ? "拨号" : item.kzcz_type == 3 ? "STK" : "-"
	                        ),
	                        _react2["default"].createElement(
	                            "th",
	                            null,
	                            item.execute_name
	                        ),
	                        _react2["default"].createElement(
	                            "th",
	                            null,
	                            item.link
	                        ),
	                        _react2["default"].createElement(
	                            "th",
	                            null,
	                            new Date(item.modify_time).format('yyyy-MM-dd hh:mm:ss')
	                        ),
	                        _react2["default"].createElement(
	                            "td",
	                            null,
	                            _react2["default"].createElement(
	                                "a",
	                                { className: "col-blue", href: "javascript:void(0)", onClick: that._editTplInfo.bind(that, item) },
	                                "详情"
	                            )
	                        )
	                    );
	                });
	            }
	        }
	    }, {
	        key: "_changeLink",
	        value: function _changeLink(e) {
	            _store2["default"].cursor().withMutations(function (cursor) {
	                cursor.set('link', e.target.value);
	            });
	        }
	    }, {
	        key: "_addTplInfo",
	        value: function _addTplInfo() {
	            this.initDialg();
	            $("#alertEditTextPic").modal("show");
	        }
	    }, {
	        key: "_change_tpl_Id",
	        value: function _change_tpl_Id(e) {
	            _store2["default"].cursor().withMutations(function (cursor) {
	                cursor.setIn(['chooseForm', 'tpl_id'], e.target.value);
	            });
	        }
	    }, {
	        key: "_change_cx_or_cz",
	        value: function _change_cx_or_cz(e) {
	            _store2["default"].cursor().withMutations(function (cursor) {
	                cursor.setIn(['chooseForm', 'cx_or_cz'], e.target.value);
	            });
	        }
	    }, {
	        key: "_change_execute_name",
	        value: function _change_execute_name(e) {
	            _store2["default"].cursor().withMutations(function (cursor) {
	                cursor.setIn(['chooseForm', 'execute_name'], e.target.value);
	            });
	        }
	    }, {
	        key: "_renderChangeExecuteNameList",
	        value: function _renderChangeExecuteNameList() {
	            var that = this;
	            return _store2["default"].data().get("userList").map(function (item, index) {
	                if (item.authority == 3 || item.authority == 1) {
	                    return _react2["default"].createElement(
	                        "option",
	                        { value: item.nick_name, selected: _store2["default"].data().getIn(['chooseForm', 'execute_name']) == item.nick_name ? "selected" : "", key: index },
	                        item.nick_name
	                    );
	                }
	            });
	        }
	    }, {
	        key: "_change_tpl_name",
	        value: function _change_tpl_name(e) {
	            _store2["default"].cursor().withMutations(function (cursor) {
	                cursor.setIn(['chooseForm', 'tpl_name'], e.target.value);
	            });
	        }
	    }, {
	        key: "_change_hf_or_sdm",
	        value: function _change_hf_or_sdm(e) {
	            _store2["default"].cursor().withMutations(function (cursor) {
	                cursor.setIn(['chooseForm', 'hf_or_sdm'], e.target.value);
	            });
	        }
	    }, {
	        key: "_searchList",
	        value: function _searchList() {
	            _iflux.msg.emit("TplInfo:queryList");
	        }
	    }, {
	        key: "_resetChooseForm",
	        value: function _resetChooseForm() {
	            _store2["default"].cursor().withMutations(function (cursor) {
	                cursor.setIn(['chooseForm', 'tpl_id'], "");
	                cursor.setIn(['chooseForm', 'cx_or_cz'], 0);
	                cursor.setIn(['chooseForm', 'tpl_name'], "");
	                cursor.setIn(['chooseForm', 'hf_or_sdm'], 0);
	                cursor.setIn(['chooseForm', 'execute_name'], "");
	                cursor.setIn(['tplData', 'pageNum'], 1);
	                cursor.setIn(['tplData', 'pageSize'], 5);
	            });
	        }
	    }, {
	        key: "_changePage",
	        value: function _changePage(newPageNum) {
	            _store2["default"].cursor().withMutations(function (cursor) {
	                cursor.setIn(['tplData', 'pageNum'], newPageNum);
	            });
	            _iflux.msg.emit("TplInfo:queryList");
	        }
	    }, {
	        key: "_changeTplId",
	        value: function _changeTplId(e) {
	            _store2["default"].cursor().withMutations(function (cursor) {
	                cursor.set('tpl_id', e.target.value);
	            });
	        }
	    }, {
	        key: "_changeTplName",
	        value: function _changeTplName(e) {
	            _store2["default"].cursor().withMutations(function (cursor) {
	                cursor.set('tpl_name', e.target.value);
	            });
	        }
	    }, {
	        key: "_saveTask",
	        value: function _saveTask() {
	            _iflux.msg.emit('TplInfo:saveTask');
	        }
	    }, {
	        key: "_changeRadio",
	        value: function _changeRadio(set, type) {
	            _store2["default"].cursor().withMutations(function (cursor) {
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
	    }, {
	        key: "_changeExecuteName",
	        value: function _changeExecuteName(e) {
	            _store2["default"].cursor().withMutations(function (cursor) {
	                cursor.set('execute_name', e.target.value);
	            });
	        }
	    }, {
	        key: "_renderExecuteNameList",
	        value: function _renderExecuteNameList() {
	            var that = this;
	            return _store2["default"].data().get("userList").map(function (item, index) {
	                if (item.authority == 3 || item.authority == 1) {
	                    return _react2["default"].createElement(
	                        "option",
	                        { value: item.nick_name, selected: _store2["default"].data().get("execute_name") == item.nick_name ? "selected" : "", key: index },
	                        item.nick_name
	                    );
	                }
	            });
	        }
	    }, {
	        key: "_changeTabType",
	        value: function _changeTabType(tab) {
	            _store2["default"].cursor().withMutations(function (cursor) {
	                cursor.set('chooseTabType', tab);
	            });
	        }
	    }, {
	        key: "_changeTplContent",
	        value: function _changeTplContent(e) {
	            _store2["default"].cursor().withMutations(function (cursor) {
	                cursor.set('tpl_content', e.target.value);
	            });
	        }
	    }, {
	        key: "initDialg",
	        value: function initDialg() {
	            _store2["default"].cursor().withMutations(function (cursor) {
	                cursor.set('flow_id', '');
	                cursor.set('tpl_id', '');
	                cursor.set('tpl_name', '');
	                cursor.set('wy_or_jk', 1);
	                cursor.set('cx_or_cz', 1);
	                cursor.set('hf_or_sdm', 1);
	                cursor.set('tpl_content', '');
	            });
	        }
	    }, {
	        key: "_editTplInfo",
	        value: function _editTplInfo(item) {
	            this.initDialg();
	            _store2["default"].cursor().withMutations(function (cursor) {
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
	    }]);

	    return TplInfo;
	})(_react2["default"].Component);

	exports["default"] = (0, _reactRouter.withRouter)((0, _iflux.connectToStore)(_store2["default"], true)(TplInfo));
	module.exports = exports["default"];

/***/ },

/***/ 567:
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 * Created by 李雪洋 on 2017/5/19.
	 */

	var _react = __webpack_require__(298);

	var _react2 = _interopRequireDefault(_react);

	var _immutable = __webpack_require__(548);

	var _immutable2 = _interopRequireDefault(_immutable);

	var _iflux = __webpack_require__(546);

	var _utilAjaxRequest = __webpack_require__(563);

	var _utilAjaxRequest2 = _interopRequireDefault(_utilAjaxRequest);

	var _utilCommonInfo = __webpack_require__(557);

	var _utilCommonInfo2 = _interopRequireDefault(_utilCommonInfo);

	var appStore = (0, _iflux.Store)({
	    chooseTab: "TplInfo",
	    chooseForm: {
	        tpl_id: "",
	        cx_or_cz: 0,
	        tpl_name: "",
	        hf_or_sdm: 0,
	        execute_name: "",
	        link: ""
	    },
	    tplData: {
	        dataList: _immutable2["default"].fromJS([]),
	        totalCount: 0,
	        pageNum: 1,
	        pageSize: 5
	    },
	    userList: [],

	    flow_id: "",
	    tpl_id: "",
	    tpl_name: "",
	    wy_or_jk: 1, //外挂类型 1,网页  2,接口, 3,空充
	    cx_or_cz: 1, //查询充值类别, 1.查询  2,充值
	    hf_or_sdm: 1, //话费或水电煤，1,话费, 2,水电煤
	    kzcz_type: 0, //空充类型: 1.短信， 2，拨号 3，STK
	    execute_name: "", //执行人
	    link: "",
	    tpl_content: "",

	    chooseTabType: "text" });
	//text 文字   pic 图片
	exports["default"] = appStore;

	_iflux.msg.on('TplInfo:queryList', function () {
	    _utilAjaxRequest2["default"].post('/queryTplInfoList', {
	        tpl_id: appStore.data().getIn(['chooseForm', 'tpl_id']),
	        cx_or_cz: appStore.data().getIn(['chooseForm', 'cx_or_cz']),
	        tpl_name: appStore.data().getIn(['chooseForm', 'tpl_name']),
	        hf_or_sdm: appStore.data().getIn(['chooseForm', 'hf_or_sdm']),
	        execute_name: appStore.data().getIn(['chooseForm', 'execute_name']),
	        pageNum: appStore.data().getIn(['tplData', 'pageNum']) - 1,
	        pageSize: appStore.data().getIn(['tplData', 'pageSize'])
	    }).then(function (res) {
	        appStore.cursor().withMutations(function (cursor) {
	            cursor.setIn(['tplData', 'totalCount'], res.totalCount);
	            cursor.setIn(['tplData', 'dataList'], _immutable2["default"].fromJS(res.aData));
	        });
	    });
	});

	_iflux.msg.on('TplInfo:queryUserList', function () {
	    _utilAjaxRequest2["default"].get('/queryUserList').then(function (res) {
	        appStore.cursor().withMutations(function (cursor) {
	            cursor.set('userList', res);
	        });
	    });
	});

	_iflux.msg.on('TplInfo:saveTask', function () {
	    _utilAjaxRequest2["default"].post('/saveTplInfo', {
	        flow_id: appStore.data().get('flow_id'),
	        tpl_id: appStore.data().get('tpl_id'),
	        tpl_name: appStore.data().get('tpl_name'),
	        wy_or_jk: appStore.data().get('wy_or_jk'),
	        cx_or_cz: appStore.data().get('cx_or_cz'),
	        hf_or_sdm: appStore.data().get('hf_or_sdm'),
	        kzcz_type: appStore.data().get('kzcz_type'),
	        create_name: _utilCommonInfo2["default"].getUserInfo().nickName,
	        execute_name: appStore.data().get('execute_name'),
	        tpl_content: appStore.data().get("tpl_content"),
	        link: appStore.data().get("link")
	    }).then(function (res) {
	        appStore.cursor().withMutations(function (cursor) {
	            cursor.setIn(['chooseForm', 'tpl_id'], "");
	            cursor.setIn(['chooseForm', 'cx_or_cz'], 0);
	            cursor.setIn(['chooseForm', 'tpl_name'], "");
	            cursor.setIn(['chooseForm', 'hf_or_sdm'], 0);
	            cursor.setIn(['chooseForm', 'execute_name'], "");
	            cursor.setIn(['tplData', 'pageNum'], 1);
	            cursor.setIn(['tplData', 'pageSize'], 5);
	        });
	        initDialg();
	        _iflux.msg.emit('TplInfo:queryList');
	    });
	});

	function initDialg() {
	    appStore.cursor().withMutations(function (cursor) {
	        cursor.set('flow_id', '');
	        cursor.set('tpl_id', '');
	        cursor.set('tpl_name', '');
	        cursor.set('wy_or_jk', 1);
	        cursor.set('cx_or_cz', 1);
	        cursor.set('hf_or_sdm', 1);
	        cursor.set('kzcz_type', 0);
	        cursor.set('tpl_content', '');
	    });
	}
	module.exports = exports["default"];

/***/ }

});