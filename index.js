// Generated by LiveScript 1.5.0
(function(){
  var ref$, all, any, concatMap, each, filter, find, fold, isType, keys, map, Obj, objToPairs, partition, reverse, sortBy, batch, clamp, findAll, get, isEmptyObject, isEqualToObject, partitionString, mappend, rextend, set, transpose, unwrap, slice$ = [].slice, toString$ = {}.toString;
  ref$ = require('prelude-ls'), all = ref$.all, any = ref$.any, concatMap = ref$.concatMap, each = ref$.each, filter = ref$.filter, find = ref$.find, fold = ref$.fold, isType = ref$.isType, keys = ref$.keys, map = ref$.map, Obj = ref$.Obj, objToPairs = ref$.objToPairs, partition = ref$.partition, reverse = ref$.reverse, sortBy = ref$.sortBy;
  batch = curry$(function(size, items){
    return fold(function(acc, item){
      var lastBatch;
      lastBatch = acc[acc.length - 1];
      if (lastBatch.length < size) {
        lastBatch.push(item);
        return acc;
      } else {
        return [].concat(acc, [[item]]);
      }
    }, [[]])(
    items);
  });
  clamp = curry$(function(n, min, max){
    return Math.max(min, Math.min(max, n));
  });
  findAll = curry$(function(text, search, offset){
    var index;
    index = text.substr(offset).toLowerCase().indexOf(search.toLowerCase());
    if (index === -1) {
      return [];
    } else {
      return [offset + index].concat(findAll(text, search, offset + index + search.length));
    }
  });
  get = curry$(function(object, arg$){
    var p, ps, ref$;
    p = arg$[0], ps = slice$.call(arg$, 1);
    if (ps.length === 0) {
      return (ref$ = object[p]) != null ? ref$ : null;
    } else {
      if (typeof object[p] === 'undefined') {
        return null;
      } else {
        return get(object[p], ps);
      }
    }
  });
  isEmptyObject = function(object){
    var this$ = this;
    return 0 === function(it){
      return it.length;
    }(
    keys(
    Obj.filter(function(it){
      return !!it;
    })(
    object)));
  };
  isEqualToObject = curry$(function(o1, o2){
    if (toString$.call(o1).slice(8, -1) !== toString$.call(o2).slice(8, -1)) {
      return false;
    }
    if (any(function(it){
      return isType(it, o1);
    })(
    ['Boolean', 'Number', 'String', 'undefined'])) {
      return o1 === o2;
    }
    if (toString$.call(o1).slice(8, -1) === 'Array') {
      if (o1.length !== o2.length) {
        return false;
      }
      return all(function(index){
        return isEqualToObject(o1[index], o2[index]);
      })(
      (function(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = o1.length; i$ < to$; ++i$) {
          results$.push(i$);
        }
        return results$;
      }()));
    } else {
      if (keys(o1).length !== keys(o2).length) {
        return false;
      }
      return all(function(key){
        return isEqualToObject(o1[key], o2[key]);
      })(
      keys(o1));
    }
  });
  partitionString = curry$(function(text, search){
    var indices, first, x, last, high, low, this$ = this;
    if (search.length === 0) {
      return [[0, text.length]];
    }
    indices = findAll(text, search, 0), first = indices[0], x = indices[indices.length - 1];
    if (indices.length === 0) {
      return [];
    }
    last = x + search.length;
    high = map(function(it){
      return [it, it + search.length, true];
    })(
    indices);
    low = map(function(i){
      return [high[i][1], high[i + 1][0], false];
    })(
    (function(){
      var i$, to$, results$ = [];
      for (i$ = 0, to$ = high.length - 1; i$ < to$; ++i$) {
        results$.push(i$);
      }
      return results$;
    }()));
    return (first === 0
      ? []
      : [[0, first, false]]).concat(sortBy(function(it){
      return it[0];
    })(
    high.concat(low)), last === text.length
      ? []
      : [[last, text.length, false]]);
  });
  mappend = curry$(function(object, path, nextValue, combinator){
    var current;
    current = get(object, path);
    return set(object, path, !!current ? combinator(current, nextValue) : nextValue);
  });
  rextend = curry$(function(a, b){
    var btype, bkeys, this$ = this;
    btype = toString$.call(b).slice(8, -1);
    if (any((function(it){
      return it === btype;
    }), ['Boolean', 'Number', 'String', 'Function'])) {
      return b;
    }
    if (a === null || 'Undefined' === toString$.call(a).slice(8, -1)) {
      return b;
    }
    bkeys = Obj.keys(b);
    if (bkeys.length === 0) {
      return a;
    }
    each(function(key){
      return a[key] = rextend(Obj.keys(a[key]).length > 0
        ? import$({}, a[key])
        : a[key], b[key]);
    })(
    bkeys);
    return a;
  });
  set = curry$(function(object, arg$, value){
    var p, ps, ref$;
    p = arg$[0], ps = slice$.call(arg$, 1);
    if (ps.length > 0) {
      object[p] = (ref$ = object[p]) != null
        ? ref$
        : {};
      return set(object[p], ps, value);
    } else {
      object[p] = value;
      return object;
    }
  });
  transpose = function(arr){
    return map(function(column){
      return map(function(row){
        return row[column];
      })(
      arr);
    })(
    keys(
    arr[0]));
  };
  unwrap = curry$(function(f, depth, object){
    var r;
    r = curry$(function(f, ks, i, j, object){
      return concatMap(function(arg$){
        var k, v;
        k = arg$[0], v = arg$[1];
        if (i < j) {
          return r(f, ks.concat(k), i + 1, j, v);
        } else {
          return f(ks.concat(k), v);
        }
      })(
      objToPairs(
      object));
    });
    return r(f, [], 0, depth, object);
  });
  module.exports = {
    batch: batch,
    clamp: clamp,
    findAll: findAll,
    get: get,
    isEmptyObject: isEmptyObject,
    isEqualToObject: isEqualToObject,
    mappend: mappend,
    partitionString: partitionString,
    rextend: rextend,
    set: set,
    transpose: transpose,
    unwrap: unwrap
  };
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
