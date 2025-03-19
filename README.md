### 일급함수 특징 + 클로저 이용

`addMaker` 예시

```
function addMaker(a) {
  return function (b) {
    return a + b;
  };
}

const add10 = addMaker(10);
console.log(add10(20));

// 함수형 프로그래밍 - 순수함수의 조합
function f4(f1, f2, f3) {
  return f3(f1(), f2());
}

console.log(
  f4(
    function () {
      return 2;
    },
    function () {
      return 1;
    },
    function (a) {
      return a * a;
    }
  )
);
```

---

<br>

## 함수형 프로그래밍(\_filter, \_map, \_each)

**함수형이 아닌 명령형 코드일 경우..**

```
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
console.log(temp_users);

// 1.2. 30세 이상인 users의 names를 수집한다
const names = [];
for (let i = 0; i < temp_users.length; i++) {
  names.push(temp_users[i].name);
}
console.log(names);

// 1.3 30세 미만인 users를 거른다.
const temp_users2 = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].age < 30) {
    temp_users2.push(users[i]);
  }
}
console.log(temp_users2);

// 1.4 30세 미만인 users의 age를 수집한다
const ages = [];
for (let i = 0; i < temp_users2.length; i++) {
  ages.push(temp_users2[i].age);
}
console.log(ages);
```

<br>

### \_filter

1.1, 1.3 코드 중복 없애고(콜백함수에 위임)  
**`\_filter`로 리팩토링하기**

```
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
```

<br>

### \_map

1.2, 1.4 코드 중복 없애고(콜백함수에 위임)  
**`\_map`로 리팩토링하기**

```
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
```

> 다형성이 높고 데이터가 어떻게 생겼는지에 대해 전혀 보이지 않게 된다.
> 즉, 관심사가 완전히 분리되어 있게 된다.
> 재사용성이 극대화된다.

<br>

### \_each 함수 만들기

`\_each` 함수를 이용해 `\_filter`, `\_map` 리팩토링

```
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
```

<br>
<br>

### each, filter, map을 배열의 프로토타입에 추가하는 방법

> this는 해당 메소드가 호출되는 배열 인스턴스를 가리킨다.

```
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
```

<br>

### ✅ `Set`을 배열로 변환

```
const set = new Set([1, 2, 3, 3, 4, 4]);
const array = Array.from(set);
console.log(array);
// 출력: [1, 2, 3, 4]
```

> `Set`은 중복을 허용하지 않음 → `Array.from()`을 사용하면 중복 제거된 배열을 얻을 수 있음
