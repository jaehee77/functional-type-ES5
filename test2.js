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
  names.push(temp_users[i].age)
}

// map
function _map(list, mapper) {
  const new_list = [];

  _each(list, function (val) {
    new_list.push(mapper(val))
  })

  return new_list;
}

const result = _map(users, user => user.age);

// filter
function _filter(list, predi) {
  const new_list = []

  _each(list, function (val) {
    if (predi(val)) new_list.push(val)
  })
  return new_list;
}

// each
function _each(list, iter) {
  for (let i = 0; i < list.length; i++) {
    iter(list[i])
  }
  return list;
}

_filter = _curryr(_filter);
_map = _curryr(_map);



// 커링
// curry
function _curry(fn) {
  return function (a, b) {
    return arguments.length === 2 ? fn(a, b) : function (b) { return fn(a, b) }
  }
}

// curryr
function _curryr(fn) {
  return function (a, b) {
    return arguments.length === 2 ? fn(a, b) : function (b) { return fn(b, a) }
  }
}

const add = _curry(function (a, b) {
  return a + b;
})
const add10 = add(10);

const sub = _curryr(function (a, b) {
  return a - b;
})

const sub10 = sub(10)
// log(sub10(45))


// get
var _get = _curryr(function (obj, key) {
  return obj === null ? undefined : obj[key]
})



/*
function (obj) {
  return obj === null ? undefined : obj['name'];
}
*/


const slice = Array.prototype.slice;

function _rest(list, num) {
  return slice.call(list, num || 1)
}

function _reduce(list, iter, memo) {
  if (arguments.length === 2) {
    memo = list[0];
    list = _rest(list);
  }
  _each(list, function (val) {
    memo = iter(memo, val)
  })
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
    return _reduce(fns, function (arg, fn) {
      return fn(arg);
    }, arg)
  }
}

const f1 = _pipe(
  function (a) { return a + 1 },
  function (a) { return a * 2 },
)

// log(f1(1))

function _go(arg) {
  const fns = _rest(arguments);
  return _pipe.apply(null, fns)(arg);
}

_go(1,
  function (a) { return a + 1 },
  function (a) { return a * 2 },
  // console.log
)

_go(users,
  users => _filter(users, user => user.age >= 30),
  users => _map(users, _get('age')),
  console.log
)


