### ✅ Array.from() vs Array.fill(), Array

```
const arr = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(arr);
// 출력: [1, 2, 3, 4, 5]
```

### ✅ 동일한 기능을 하는 다른 방법

1️⃣ `Array.fill()` + `map()`

```
const arr = Array(5).fill(0).map((_, i) => i + 1);
console.log(arr);
// 출력: [1, 2, 3, 4, 5]
```

2️⃣ `spread` 연산자와 `keys()`

```
const arr = [...Array(5).keys()].map(i => i + 1);
console.log(arr);
// 출력: [1, 2, 3, 4, 5]
```

🚀 Array.from()을 사용하면 더 직관적이고 깔끔한 코드가 가능!
