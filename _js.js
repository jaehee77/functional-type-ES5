const _get = _curryr(function (obj, key) {
  return obj === null ? undefined : obj[key];
});

function _is_object(obj) {
  return typeof obj === 'object' && !!obj;
}

function _keys(obj) {
  return _is_object(obj) ? Object.keys(obj) : [];
}

const _length = _get('length');

function _each(list, iter) {
  const keys = _keys(list);
  for (let i = 0, len = keys.length; i < len; i++) {
    iter(list[keys[i]]);
  }
  return list;
}

function _map(list, mapper) {
  const new_list = [];

  _each(list, function (item) {
    new_list.push(mapper(item));
  });

  return new_list;
}

function _filter(list, predi) {
  const new_list = [];

  _each(list, function (item) {
    if (predi(item)) new_list.push(item);
  });

  return new_list;
}

function _curry(fn) {
  return function (a, b) {
    return arguments.length === 2 ? fn(a, b) : (b) => fn(a, b);
  };
}

function _curryr(fn) {
  return function (a, b) {
    return arguments.length === 2 ? fn(a, b) : (b) => fn(b, a);
  };
}

const slice = Array.prototype.slice;
function rest(list, num) {
  return slice.call(list, num || 1);
}

function _reduce(list, iter, memo) {
  if (arguments.length === 2) {
    memo = list[0];
    list = rest(list);
  }

  _each(list, function (val) {
    memo = iter(memo, val);
  });

  return memo;
}

// prettier-ignore
function _pipe() {
  const fns = arguments; 
  
  return function (arg) { 
    return _reduce(fns, function (arg, fn) { 
        return fn(arg);
      }, arg );
  };
}

// prettier-ignore
function _go(initValue) {
  const fns = rest(arguments);
  return _pipe.apply(null, fns)(initValue)
}

let _values = _map(_identify);

function _identify(val) {
  return val;
}
