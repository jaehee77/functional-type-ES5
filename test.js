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
// ======================================================================
{
  let temp_users = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].age >= 30) {
      temp_users.push(users[i]);
    }
  }
  log(temp_users);

  let user = [];

  for (let i = 0; i < temp_users.length; i++) {
    user.push(temp_users[i].name);
  }
  log(user);
}
// ======================================================================

const _get = _curryr(function (obj, key) {
  return obj === null ? undefined : obj[key];
});

const user2 = users[2];
log(_get(user2, 'name'));
log(_get('name')(user2));

const get_name = _get('name');
log(_get('name'));
log(get_name(users[2]));
log(get_name(users[1]));

// ======================================================================

const _length = _get('length');

function _each(list, iter) {
  const keys = _keys(list);
  for (let i = 0, len = keys.length; i < len; i++) {
    iter(list[keys[i]]);
  }
  return list;
}

_each([2, 4, 6], function (item) {
  log(item);
});
// ======================================================================
function _filter(list, predi) {
  const new_list = [];

  _each(list, function (item) {
    if (predi(item)) new_list.push(item);
  });

  return new_list;
}

log(
  _filter(users, function (item) {
    return item.age >= 30;
  })
);

// log(_filter([1, 2, 3, 4], (item) => item % 2));
// log(_filter([1, 2, 3, 4], (item) => !(item % 2)));
// ======================================================================
function _map(list, mapper) {
  const new_list = [];

  _each(list, function (item) {
    new_list.push(mapper(item));
  });

  return new_list;
}

// log(
//   _map(users, function (item) {
//     return item.age;
//   })
// );

log(
  _map(
    _filter(users, (item) => item.age >= 30),
    (item) => item.name
  )
);

// ======================================================================

function _curry(fn) {
  return function (a, b) {
    return arguments.length === 2 ? fn(a, b) : (b) => fn(a, b);
  };
}

// ======================================================================

function _curryr(fn) {
  return function (a, b) {
    return arguments.length === 2 ? fn(a, b) : (b) => fn(b, a);
  };
}

// ### filter, map 에 curryr 적용
_filter = _curryr(_filter);
_map = _curryr(_map);

// ======================================================================

// curry를 이용해 add 함수를 만듦
const add = _curry((a, b) => a + b);

// log(add);
const add10 = add(10);

log(add10(20));
log(add(1)(2));
log(add(1, 2));

// ======================================================================

const sub = _curryr((a, b) => a - b);

const sub10 = sub(10);
log(sub10(20));
log(sub(10)(20));
log(sub(20, 10));

// ======================================================================
console.clear();
log(
  _map(
    _filter(users, (user) => user.age >= 30),
    (item) => item.name
  )
);

log(
  _map(
    _filter(users, (user) => user.age >= 30),
    _get('name')
  ),
  _map(
    _filter(users, (user) => user.age < 30),
    _get('age')
  )
);

// ======================================================================

/**
 * _reduce 만들기
 */
let a = [1, 2, 3];
log(a.slice(1));
log(a.slice(2));
log(a.slice(3));

let b = {
  0: 'html',
  1: 'doc',
  2: 'java',
  length: 3,
};
let node = document.querySelectorAll('*');
const sliceCopy = Array.prototype.slice;
log(node);
log(sliceCopy.call(node, 3));

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

log(_reduce([1, 2, 3, 4], (a, b) => a + b, 0));

log(_reduce([1, 2, 3], (a, b) => a + b));

log(_reduce([1, 2, 3, 4], (a, b) => a + b, 10));

console.clear();

// ======================================================================

/**
 * _pipe 만들기
 * -> 함수를 연속적으로 실행해 주는 함수
 * 파이프라인은 들어온 함수들을 차례대로 연속적으로 실행할 준비가 된 함수를 리턴하는 함수
 * 파이프라인은 결국 reduce인데, reduce보다 좀더 특화된 함수, 추상화된 함수임
 * _pipe()는 결국 여러 개의 함수를 하나의 흐름으로 연결하는 역할을 함.
 */

// prettier-ignore
function _pipe() {
  const fns = arguments; // 전달된 함수들을 저장 유사배열 객체
  // fns = {
  //   0: function (a) { return a + 1; },
  //   1: function (b) { return b * 2; },
  //   length: 2
  // }
  
  return function (arg) { // 초기값을 받는 내부 함수 반환
    return _reduce(fns, function (arg, fn) { // fns(arraylike 객체)
      // memo = iter(memo, 순회대상(값)), 여기서 순회대상은 함수임
      // iter(1, fn1); => function (arg, fn) => function(1, fn1)
      // => memo에 fn(1) 이 값 담김
      // iter(memo, val) 가 function (arg, fn){} 이 함수니까 여기에 리턴값이 있어야 memo에 담김
      // 왜? iter 함수실행하고 리턴값 없으면 undefined 가 반환되니까.
      // 즉, 아래 코드와 같음. return fn1(1)
        return fn(arg);
      }, arg );
  };
}

// 파이프는 함수를 리턴하는 함수
// prettier-ignore
const f1 = _pipe(
  function (a) { return a + 1; }, // 1 + 1
  function (b) { return b * 2; } // 2 * 2
);

log(f1(1));

/*
_reduce([fn1, fn2], function (arg, fn) {
  return fn(arg);
}, 1);
1. 첫 번째 순회
memo = fn1(1); // 1 + 1 = 2
2. 두 번째 순회
memo = fn2(2); // 2 * 2 = 4
*/

// ======================================================================

/**
 * _go
 * 파이프 함수이면서 즉시 실행되는 파이프 함수이다.
 * (pipe는 함수만 리턴하고 나중에 실행함)
 * go는 첫 번째 인자로 값을 받고 두 번째 인자부터 함수를 받아서 결과를 실행
 */

// prettier-ignore
function _go(initValue) {
  const fns = rest(arguments);
  return _pipe.apply(null, fns)(initValue)
}

// prettier-ignore
_go(
  1,
  function (a) { return a + 1; }, 
  function (a) { return a * 2; }, 
  function (a) { return a * a; }, 
  console.log
);

log(
  _map(
    _filter(users, (user) => user.age >= 30),
    _get('name')
  )
);

// prettier-ignore
_go(
  users,
  function(users) {
    return _filter(users, function(user) {
      return user.age >= 30
    })
  },
  function(users) {
    return _map(users, _get('name'))
  },
  console.log
);

// curryr 적용
// prettier-ignore
log(
  _map([1,2,3], function(item) { return item * 2})
)

// prettier-ignore
log(
  _map(function(item) {return item * 2})([1,2,3])
)

// prettier-ignore
// curryr이 적용된 filter, map을 사용
_go(
  users,
  _filter(function(user) { return user.age >= 30 }),
  _map(_get('name')),
  console.log
);
// 더 간결하게 작성
_go(
  users,
  _filter((user) => user.age >= 30),
  _map(_get('name')),
  log
);

// ======================================================================

_each(null, console.log);

// ======================================================================

//
/**
 * _keys 만들기
 */
log(Object.keys({ name: 'jaehee', age: 33 }));
log(Object.keys([1, 2, 5, 6]));
log(Object.keys(10));

// null 은 에러가 남
// log(Object.keys(null));

function _is_object(obj) {
  return typeof obj === 'object' && !!obj;
}

function _keys(obj) {
  return _is_object(obj) ? Object.keys(obj) : [];
}

log(_keys({ name: 'jaehee', age: 33 }));
log(_keys([1, 2, 5, 6]));
log(_keys(10));
log(_keys(null));
log(
  _keys({
    13: 'AB',
    19: 'CD',
    23: 'EF',
  })
);

_each(
  {
    13: 'AB',
    19: 'CD',
    23: 'EF',
  },
  function (name) {
    log(name);
  }
);

log(
  _map(
    {
      13: 'AB',
      19: 'CD',
      23: 'EF',
    },
    function (name) {
      return name.toLowerCase();
    }
  )
);

// prettier-ignore
_go(
  users,
  _map(user => user.name),
  _map(name => name.toLowerCase()),
  console.log
)
console.clear();
