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

log(
  _reject(users, function (user) {
    return user.age > 30;
  })
);
