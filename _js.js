function _each(list, iter) {
  for (let i = 0; i < list.length; i++) {
    iter(list[i]);
  }
  return list;
}

function _map(list, mapper) {
  const new_list = [];

  _each(list, function (item) {
    new_list.push(mapper(item));
  });

  return new_list;
}

function _filter(list, predi) {
  const new_list = [];

  _each(list, function (item) {
    if (predi(item)) new_list.push(item);
  });

  return new_list;
}

const _curry = (fn) => {
  return function (a, b) {
    return arguments.length === 2 ? fn(a, b) : (b) => fn(a, b);
  };
};

const _curryr = (fn) => {
  return function (a, b) {
    return arguments.length === 2 ? fn(a, b) : (b) => fn(b, a);
  };
};

const _get = _curryr(function (obj, key) {
  return obj === null ? undefined : obj[key];
});
