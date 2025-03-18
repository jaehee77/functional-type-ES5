const users = [
  { id: 1, name: 'ID', age: 32 },
  { id: 2, name: 'HA', age: 25 },
  { id: 3, name: 'BJ', age: 32 },
  { id: 4, name: 'PJ', age: 28 },
  { id: 5, name: 'JE', age: 27 },
  { id: 6, name: 'JM', age: 32 },
  { id: 7, name: 'HI', age: 24 },
  { id: 8, name: 'MP', age: 23 },
];

// 1. 명령형 코드
// 1.1 30세 이상인 users를 거른다.
// 1.2 30세 이상인 users의 names를 수집한다.
// 1.3 30세 미만인 users를 거른다.
// 1.4 30세 미만인 users의 ages를 수집한다.

// 1.1 30세 이상인 users를 거른다.
const temp_users = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].age >= 30) {
    temp_users.push(users[i]);
  }
}
// console.log(temp_users);

// 1.2. 30세 이상인 users의 names를 수집한다
const names = [];
for (let i = 0; i < temp_users.length; i++) {
  names.push(temp_users[i].name);
}
// console.log(names);

// 1.3 30세 미만인 users를 거른다.
const temp_users2 = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].age < 30) {
    temp_users2.push(users[i]);
  }
}
// console.log(temp_users2);

// 1.4 30세 미만인 users의 age를 수집한다
const ages = [];
for (let i = 0; i < temp_users2.length; i++) {
  ages.push(temp_users2[i].age);
}
// console.log(ages);

/**
 * 2.1 [filter]
 * 1.1, 1.3 코드 중복 없애고(콜백함수에 위임)
 * _filter로 리팩토링하기
 */

function _filter(list, predi) {
  const new_list = [];
  for (let i = 0; i < list.length; i++) {
    if (predi(list[i])) {
      new_list.push(list[i]);
    }
  }
  return new_list;
}
console.log(
  _filter(users, function (user) {
    return user.age >= 30;
  }),
  _filter(users, function (user) {
    return user.age < 30;
  })
);

console.log(
  _filter([1, 2, 3, 4], function (num) {
    return num % 2;
  }),
  _filter([1, 2, 3, 4], function (num) {
    return !(num % 2);
  })
);

/**
 * 2.2 [map]
 * 1.2, 1.4 코드 중복 없애고(콜백함수에 위임)
 * _map으로 리팩토링하기
 */
function _map(list, mapper) {
  const new_list = [];
  for (let i = 0; i < list.length; i++) {
    new_list.push(mapper(list[i]));
  }
  return new_list;
}

console.log(
  _map(
    _filter(users, function (user) {
      return user.age >= 30;
    }),
    function (user) {
      return user.name;
    }
  ),
  _map(
    _filter(users, function (user) {
      return user.age < 30;
    }),
    function (user) {
      return user.age;
    }
  )
);

console.log(
  _map([1, 2, 3], function (num) {
    return num * 2;
  }),
  _map([1, 2, 3], function (num) {
    return num * num;
  })
);

// 다형성이 높고 데이터가 어떻게 생겼는지에 대해 전혀 보이지 않게 된다.
// 즉, 관심사가 완전히 분리되어 있게 된다.
// 재사용성이 극대화된다.

/**
 * _each 함수로 정의
 * _each 함수를 이용해 _filter, _map 리팩토링
 */

function _each(list, iterate) {
  for (let i = 0; i < list.length; i++) {
    iterate(list[i]);
  }
  return list;
}

function _filter(list, predi) {
  const new_list = [];

  _each(list, function (item) {
    if (predi(item)) {
      new_list.push(item);
    }
  });

  return new_list;
}

function _map(list, mapper) {
  const new_list = [];

  _each(list, function (item) {
    new_list.push(mapper(item));
  });

  return new_list;
}

/**
 * each, filter, map을 배열의 프로토타입에 추가하는 방법
 */

// this는 해당 메소드가 호출되는 배열 인스턴스를 가리킨다.

Array.prototype._each = function (iterate) {
  for (let i = 0; i < this.length; i++) {
    iterate(this[i], i, this);
  }
  return this;
};
Array.prototype._filter = function (predi) {
  const new_list = [];

  this._each(function (item) {
    if (predi(item)) {
      new_list.push(item);
    }
  });

  return new_list;
};

Array.prototype._map = function (mapper) {
  const new_list = [];

  this._each(function (item) {
    new_list.push(mapper(item));
  });

  return new_list;
};

// 사용 예시
const arr = [1, 2, 3, 4, 5];

// _each 사용
arr._each((item) => console.log(item)); // 출력: 1, 2, 3, 4, 5

// _filter 사용
const evenNumbers = arr._filter((item) => item % 2 === 0);
console.log(evenNumbers); // 출력: [2, 4]

// _map 사용
const doubledNumbers = arr._map((item) => item * 2);
console.log(doubledNumbers); // 출력: [2, 4, 6, 8, 10]

{
  const arr = [1, 2, 3, 4, 5];

  arr._each(function (item) {
    console.log(this); // 여기서 this는 arr 배열을 가리킴
  });
}
