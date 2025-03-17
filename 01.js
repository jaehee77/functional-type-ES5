const users = [
    {id: 1, name: 'ID', age: 32},
    {id: 2, name: 'HA', age: 25},
    {id: 3, name: 'BJ', age: 32},
    {id: 4, name: 'PJ', age: 28},
    {id: 5, name: 'JE', age: 27},
    {id: 6, name: 'JM', age: 32},   
    {id: 7, name: 'HI', age: 24},
    {id: 8, name: 'MP', age: 23},
];

// 1. 명령형 코드
// 1.1 30세 이상인 users를 거른다.
// 1.2 30세 이상인 users의 names를 수집한다.
// 1.3 30세 미만인 users를 거른다.
// 1.4 30세 미만인 users의 ages를 수집한다.

// 1.1 30세 이상인 users를 거른다.
const temp_users = [];
for (let i = 0; i < users.length; i++) {
    if(users[i].age >= 30) {
        temp_users.push(users[i]);
    }
}
// console.log(temp_users);

// 1.2. 30세 이상인 users의 names를 수집한다
const names = [];
for(let i = 0; i < temp_users.length; i++) {
    names.push(temp_users[i].name);
}
// console.log(names);

// 1.3 30세 미만인 users를 거른다.
const temp_users2 = [];
for (let i = 0; i < users.length; i++) {
    if(users[i].age < 30) {
        temp_users2.push(users[i]);
    }
}
// console.log(temp_users2);

// 1.4 30세 미만인 users의 age를 수집한다
const ages = [];
for(let i = 0;i < temp_users2.length; i++) {
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
        if(predi(list[i])) {
            new_list.push(list[i]);
        }
    }
    return new_list;
}
console.log(
    _filter(users, function(user) {return user.age >= 30;}),
    _filter(users, function(user) {return user.age < 30;}),
);   

console.log(
    _filter([1,2,3,4], function(num) {return num % 2;}),
    _filter([1,2,3,4], function(num) {return !(num % 2);}),
);



/**
 * 2.2 [map]
 * 1.2, 1.4 코드 중복 없애고(콜백함수에 위임)
 * _map으로 리팩토링하기
 */
function _map(list, mapper) {
    const new_list = [];
    for(let i = 0; i < list.length; i++) {
        new_list.push(mapper(list[i]));
    }
    return new_list;
}

console.log(
    _map(
        _filter(users, function(user) {return user.age >= 30;}),
        function(user) {return user.name;}
    ),
    _map(
        _filter(users, function(user) {return user.age < 30;}),
        function(user) {return user.age;}
    ),
);

console.log(
    _map([1,2,3], function(num) {return num * 2;}),
    _map([1,2,3], function(num) {return num * num;}),
);

// 다형성이 높고 데이터가 어떻게 생겼는지에 대해 전혀 보이지 않게 된다.
// 즉, 관심사가 완전히 분리되어 있게 된다.
// 재사용성이 극대화된다.
