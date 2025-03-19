// 커링(curring)
// 함수와 인자를 다루는 기법

// 커링(Currying) 함수는 여러 개의 인자를 받는 함수를,
// 하나의 인자만 받는 함수들이 연속적으로 호출되도록 변환하는 기법입니다.
// 즉, 함수를 분할하여 부분적으로 인자를 받을 수 있게 만들어주는 방식
// 함수에 인자를 하나씩 적용해 나가다가 필요한 인자가 모두 채워지면 함수 본체를 실행하는 기법

// _curry, _curryr
// 원하는 시점까지 미루어 두었다가 평가함
{
  function _curry(fn) {
    return function (a) {
      return function (b) {
        return fn(a, b);
      };
    };
  }

  const add = _curry(function (a, b) {
    return a + b;
  });
  const add10 = add(10);

  console.log(add10(5));

  console.log(add(20)(30));
}

/*
function curry(fn) {
  return add = function (a) { // add 변수에는  이 부분을 참조(리턴), add(10) 을 호출하면 a 인자 받고
    return function (b) { // add10() 호출하면 이 부분이 리턴
      return fn(a, b); // 클로저로 인해 add10() 호출하면 이 fn() 호출됨
    };
  };
}
*/

// 커링은 함수형 프로그래밍에서 자주 사용되는 기법으로, 함수를 여러 개의 함수로 분할하여 점진적으로 인자를 받게 하는 방법입니다.
// 이를 통해 코드 재사용성을 높이고, 다양한 방식으로 함수를 조합하여 사용할 수 있게 됩니다.

// _curry 다형성 높이기
{
  function _curry(fn) {
    return function (a, b) {
      if (arguments.length === 2) return fn(a, b);
      return function (b) {
        return fn(a, b);
      };
    };
  }

  const add = _curry(function (a, b) {
    return a + b;
  });

  console.log(add(10, 20));

  console.log(add(30)(30));
}

{
  function _curry(fn) {
    return function (a, b) {
      return arguments.length === 2
        ? fn(a, b)
        : function (b) {
            return fn(a, b);
          };
    };
  }

  const add = _curry(function (a, b) {
    return a + b;
  });

  console.log(add(10, 20));

  console.log(add(30)(30));
}

{
  function _curry(fn) {
    return function (a, b) {
      return arguments.length === 2 ? fn(a, b) : (b) => fn(a, b);
    };
  }

  const add = _curry(function (a, b) {
    return a + b;
  });

  console.log(add(10, 20));

  console.log(add(30)(30));
}

{
  // argurments 객체는 화살표 함수에서 사용 X
  // 화살표 함수에서 this 바인딩 때문임.
  const _curry =
    (fn) =>
    (...args) =>
      args.length === 2 ? fn(...args) : (b) => fn(args[0], b);

  const add = _curry((a, b) => a + b);

  console.log(add(1, 2));

  console.log(add(1)(2));
}

{
  // _curryr : 오른쪽부터 인자를 적용하는 함수
  function _curryr(fn) {
    return function (a, b) {
      return arguments.length === 2 ? fn(a, b) : (b) => fn(b, a);
    };
  }

  const sub = _curryr((a, b) => a - b);

  console.log(sub(5, 1));

  const sub10 = sub(10);
  console.log(sub10(20));
}

/**
 * _get 만들기
 * 객체에 있는 값을 안전하게 참조하는 함수
 */
{
  const users = [
    { id: 1, name: 'ID', age: 32 },
    { id: 2, name: 'HA', age: 25 },
    { id: 3, name: 'BJ', age: 32 },
    { id: 4, name: 'PJ', age: 28 },
    { id: 5, name: 'JE', age: 27 },
    { id: 6, name: 'JM', age: 32 },
    { id: 7, name: 'HI', age: 24 },
  ];

  const _get = (obj, key) => {
    return obj === null ? undefined : obj[key];
  };
  const user1 = users[0];
  console.log(user1.name);

  console.log(_get(user1, 'name'));
}

{
  // curryr 이 적용된 _get
  const users = [
    { id: 1, name: 'ID', age: 32 },
    { id: 2, name: 'HA', age: 25 },
    { id: 3, name: 'BJ', age: 32 },
    { id: 4, name: 'PJ', age: 28 },
    { id: 5, name: 'JE', age: 27 },
    { id: 6, name: 'JM', age: 32 },
    { id: 7, name: 'HI', age: 24 },
  ];

  const _get = _curryr((obj, key) => {
    return obj === null ? undefined : obj[key];
  });
  const user2 = users[1];

  console.log(_get(user2, 'name'));

  console.log(_get('name')(user2));

  const get_name = _get('name');
  console.log(get_name(user2));
  console.log(get_name(users[3]));

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

  // _get 으로 간결하기 만들어 보기
  console.log(
    _map(
      _filter(users, function (user) {
        return user.age >= 30;
      }),
      _get('name')
    ),
    _map(
      _filter(users, function (user) {
        return user.age < 30;
      }),
      _get('age')
    )
  );
}

/**
 * _reduce 만들기
 * 원래 들어온 자료와 다른 축약된 새로운 자료를 만들때 사용
 */

// function _reduce( [1,2,3], iter, memo) {
//   return iter(iter(iter(0,1),2),3)
// }

// _reduce([1,2,3], add, memo);

// 단계
/*
memo = add(0, 1);
memo = add(memo, 2);
memo = add(memo, 3);
return memo;
// 결과적으로 재귀적 함수임
add(add(add(0,1),2),3)
*/
