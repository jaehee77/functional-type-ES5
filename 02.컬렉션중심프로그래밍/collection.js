/**
 * 컬렉션 중심 프로그래밍의 4가지 유형과 함수
 */

// 1. 수집하기 - map, values, pluck 등
// 2. 거르기 - filter, reject, compact, without 등
// 3. 찾아내기 - find, some, every 등
// 4. 접기(축약) - reduce, min, max, group_by, count_by 등

// const users = [
//   { id: 1, name: 'ID', age: 32 },
//   { id: 2, name: 'HA', age: 25 },
//   { id: 3, name: 'BJ', age: 30 },
//   { id: 4, name: 'PJ', age: 28 },
//   { id: 5, name: 'JE', age: 27 },
//   { id: 6, name: 'JM', age: 35 },
//   { id: 7, name: 'HI', age: 24 },
//   { id: 8, name: 'MP', age: 23 },
// ];

log(_map(users, (user) => user.name));

log(_map(users[0], (user0) => user0));

// ================================================================
// 1. 수집하기 - map
// 1.1 values

/**
 * 리팩토링 전.. 
function _values(data) {
  return _map(data, _identify);
}
*/

_values = _map(_identify);

function _identify(val) {
  return val;
}

log(_values(users[0]));

log(_map(_identify)(users[0]));

console.clear();

// ================================================================
// 2.2 _pluck(뽑다)

function _pluck(data, key) {
  return _map(data, function (obj) {
    return obj[key];
  });
}
log(_pluck(users, 'name'));

// ================================================================
// 2. 거르기 - filter
// 2.1 reject

log(
  _filter(users, function (user) {
    return user.age > 30;
  })
);

function _negate(func) {
  return function (val) {
    return !func(val);
  };
}

function _reject(data, predi) {
  return _filter(data, _negate(predi));
}

_reject = _curryr(_reject);

log(
  _reject(users, function (user) {
    return user.age > 30;
  })
);

// ================================================================
// 2.2 compact : truthy값만 반환
const _compact = _filter(_identify);

log(_compact([1, 2, 0, false, null, [true]]));

/**
 *
 * find
 *
 */
// ================================================================
// 3. 찾아내기 - find
// 3.1 find 만들기
function _find(list, predi) {
  const keys = _keys(list);
  for (let i = 0, len = keys.length; i < len; i++) {
    const val = list[keys[i]];
    if (predi(val)) return val;
  }
}
_find = _curryr(_find);

log(
  _find(users, function (user) {
    return user.id === 2;
  })
);

log(
  _get(
    _find(users, (user) => user.id === 2),
    'name'
  )
);

// prettier-ignore
_go(users,
    _find(function(user) { return user.id === 2; }),
    _get('name'),
    console.log
  )

// ================================================================
// 3.2 find_index
function _find_index(list, predi) {
  const keys = _keys(list);
  for (let i = 0, len = keys.length; i < len; i++) {
    const val = list[keys[i]];
    if (predi(val)) return i;
  }
  return -1;
}

_find_index = _curryr(_find_index);

log(_find_index(users, (user) => user.id === 2));

//
// ================================================================
// 3.3 some : 어느 하나라도 만족하는가?

function _some(data, predi) {
  return _find_index(data, predi) !== -1;
}

log(
  _some([1, 2, 5, 10, 20], function (val) {
    return val > 20;
  })
);

//
// ================================================================
// 3.4 every : 모두 만족하는가?

function _every(data, predi) {
  return _find_index(data, _negate(predi)) === -1;
}

log(
  _every([12, 24, 5, 10, 20], function (val) {
    return val > 3;
  })
);

/**
 *
 * 4. 접기 - reduce
 * 4.1. min, max, min_by, max_by
 * 4.2. group_by, push
 * 4.3. count_by, inc
 *
 */

// ================================================================
// 4.1 min

function _min(data) {
  return _reduce(data, function (a, b) {
    return a < b ? a : b;
  });
}
// (a, b) => a < b ? a : b를 이용해서 더 작은 값을 계속해서 유지.

log(_min([-1, 1, -4, 10, 5, -5]));

// ================================================================
// 4.1 max

function _max(data) {
  return _reduce(data, function (a, b) {
    return a > b ? a : b;
  });
}

log(_max([1, 2, 4, 10, 5, -4]));

// ================================================================
// 4.1 min_by

function _min_by(data, predi) {
  return _reduce(data, function (a, b) {
    return predi(a) < predi(b) ? a : b;
  });
}

log(_min_by([-1, 1, -4, 10, 5, -5], Math.abs));
log(_min_by([-20, 20], Math.abs));

// ================================================================
// 4.1 max_by

function _max_by(data, predi) {
  return _reduce(data, function (a, b) {
    return predi(a) > predi(b) ? a : b;
  });
}

// curryr 적용
_min_by = _curryr(_min_by);
_max_by = _curryr(_max_by);

log(_max_by([1, 2, 10, 4, -10, 5, -4], Math.abs));

log(_max_by(users, (user) => user.age));

// 30대 이상중에 가장 어린 사람을 뽑아냄
_go(
  users,
  _filter((user) => user.age >= 30),
  _min_by((over30) => over30.age),
  console.log
);
_go(
  users,
  _filter((user) => user.age >= 30),
  _min_by(_get('age')),
  _get('age'),
  console.log
);
_go(
  users,
  _filter((user) => user.age >= 30),
  _map(_get('age')),
  _min,
  console.log
);
_go(
  users,
  _reject((user) => user.age >= 30),
  _max_by(_get('age')),
  _get('name'),
  console.log
);

// ================================================================
// 4.2. group_by

/* 아래와 같은 형태로 그룹핑
const user2 = {
  36: [{ id: 1, name: 'ID', age: 36 }],
  30: [
    { id: 3, name: 'KW', age: 30 },
    { id: 7, name: 'QP', age: 30 },
  ],
  25: [{ id: 5, name: 'PD', age: 25 }],
  ...
};
*/

// ================================================================
// 4.2. inc
