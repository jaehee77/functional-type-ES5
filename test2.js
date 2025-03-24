const log = console.log;

const users = [
  { id: 0, name: 'KF', age: 15 },
  { id: 1, name: 'ID', age: 32 },
  { id: 2, name: 'HA', age: 25 },
  { id: 3, name: 'BJ', age: 30 },
  { id: 4, name: 'PJ', age: 28 },
  { id: 5, name: 'JE', age: 27 },
  { id: 6, name: 'JM', age: 35 },
  { id: 7, name: 'HI', age: 24 },
  { id: 8, name: 'MP', age: 23 },
  { id: 9, name: 'SP', age: 30 },
];

const temp_users = [];

for (let i = 0; i < users.length; i++) {
  if (users[i].age >= 30) {
    temp_users.push(users[i]);
  }
}

const names = [];
for (let i = 0; i < temp_users.length; i++) {
  names.push(temp_users[i].age);
}

// get
var _get = _curryr(function (obj, key) {
  return obj === null ? undefined : obj[key];
});
let _length = _get('length');

// log(_keys(10), _keys(null));

function _is_object(obj) {
  return typeof obj == 'object' && !!obj;
}

function _keys(obj) {
  return _is_object(obj) ? Object.keys(obj) : [];
}

// map
function _map(list, mapper) {
  const new_list = [];

  _each(list, function (val) {
    new_list.push(mapper(val));
  });

  return new_list;
}

const result = _map(users, (user) => user.age);

// filter
function _filter(list, predi) {
  const new_list = [];

  _each(list, function (val) {
    if (predi(val)) new_list.push(val);
  });
  return new_list;
}

// each
function _each(list, iter) {
  const keys = _keys(list);
  for (let i = 0, len = keys.length; i < len; i++) {
    iter(list[keys[i]]);
  }
  return list;
}

// log(_map(null, (user) => user.name));

_filter = _curryr(_filter);
_map = _curryr(_map);

// 커링
// curry
function _curry(fn) {
  return function (a, b) {
    return arguments.length === 2
      ? fn(a, b)
      : function (b) {
          return fn(a, b);
        };
  };
}

// curryr
function _curryr(fn) {
  return function (a, b) {
    return arguments.length === 2
      ? fn(a, b)
      : function (b) {
          return fn(b, a);
        };
  };
}

const add = _curry(function (a, b) {
  return a + b;
});
const add10 = add(10);

const sub = _curryr(function (a, b) {
  return a - b;
});

const sub10 = sub(10);
// log(sub10(45))

/*
function (obj) {
  return obj === null ? undefined : obj['name'];
}
*/

const slice = Array.prototype.slice;

function _rest(list, num) {
  return slice.call(list, num || 1);
}

function _reduce(list, iter, memo) {
  if (arguments.length === 2) {
    memo = list[0];
    list = _rest(list);
  }
  _each(list, function (val) {
    memo = iter(memo, val);
  });
  return memo;
}

// log(
//   _reduce([1, 2, 3], function (a, b) {
//     return a + b
//   }, 0)
// )

// log(
//   _reduce([1, 2, 3, 4], function (a, b) {
//     return a + b
//   })
// )

function _pipe() {
  const fns = arguments;
  return function (arg) {
    return _reduce(
      fns,
      function (arg, fn) {
        return fn(arg);
      },
      arg
    );
  };
}

const f1 = _pipe(
  function (a) {
    return a + 1;
  },
  function (a) {
    return a * 2;
  }
);

// log(f1(1))

function _go(arg) {
  const fns = _rest(arguments);
  return _pipe.apply(null, fns)(arg);
}

_go(
  1,
  function (a) {
    return a + 1;
  },
  function (a) {
    return a * 2;
  }
  // console.log
);

// _go(users,
//   users => _filter(users, user => user.age >= 30),
//   users => _map(users, _get('age')),
//   console.log
// )

_go(
  users,
  _filter((user) => user.age < 30),
  _map(_get('name'))
  // console.log
);

// log(_map({ 2: 'ID', 4: 'SE' }, (user) => user));

_go(
  { 2: 'ID', 4: 'SE' },
  _map((name) => name.toLowerCase())
  // console.log
);

// log(_map(users[0], (user) => user));

//
/*
function _values(data) {
  return _map(data, _identify);
}
*/
// 더 간단히 만들기
var _values = _map(_identify);
function _identify(val) {
  return val;
}

// log(_values(users[0]));

// log(_map(_identify)(users[0]));

// 첫번째 방법
/*
function _pluck(data, key) {
  return _map(data, function (obj) {
    return obj[key];
  });
}
*/

// 두 번째 방법
function _pluck(data, key) {
  return _map(data, _get(key));
}

// log(_pluck(users, 'name'));

function _negate(func) {
  return function (val) {
    return !func(val);
  };
}

/*
function _reject(data, predi) {
  return _filter(data, function (val) {
    return !predi(val);
  });
}
*/
function _reject(data, predi) {
  return _filter(data, _negate(predi));
}

// log(
//   _reject(users, function (user) {
//     return user.age >= 30;
//   })
// );

// function _compact(data) {
//   return _filter(data, function (val) {
//     return !!val;
//   });
// }

var _compact = _filter(_identify);

log(_compact([1, 2, 0, false, null, {}]));
