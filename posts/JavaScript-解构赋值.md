---
title: JavaScript-解构赋值
date: 2017-07-28 17:44:29
category: JavaScript
---
摘录自[ECMAScript 6 入门 - 阮一峰](http://es6.ruanyifeng.com/)
### 基本用法
ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。
```javascript
let [a, b, c] = [1, 2, 3];  
```
上面代码表示，可以从数组中提取值，按照对应位置，对变量赋值。
<!--more-->
本质上，这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值。下面是一些使用嵌套数组进行解构的例子。
```javascript
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3

let [ , , third] = ["foo", "bar", "baz"];
third // "baz"

let [x, , y] = [1, 2, 3];
x // 1
y // 3

let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []
```
解构赋值允许指定默认值。
```javascript
let [foo = true] = [];
foo // true

let [x, y = 'b'] = ['a']; // x='a', y='b'
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'
```
注意，ES6 内部使用严格相等运算符（===），判断一个位置是否有值。所以，如果一个数组成员不严格等于 `undefined`，默认值是不会生效的。
### 对象的解构赋值
对象的解构中，变量必须与属性同名，才能取到正确的值。
```javascript
let { foo: baz } = { foo: "aaa", bar: "bbb" };
baz // "aaa"
foo // error: foo is not defined
```
上面代码中，`foo` 是匹配的模式，`baz` 才是变量。真正被赋值的是变量 `baz`，而不是模式 `foo`。

使用一个稍复杂的例子进一步说明：
```javascript
var node = {
  loc: {
    start: {
      line: 1,
      column: 5
    }
  }
};

var { loc, loc: { start }, loc: { start: { line }} } = node;
line // 1
loc  // Object {start: Object}
start // Object {line: 1, column: 5}
```
上面代码有三次解构赋值，分别是对 `loc`、`start`、`line`三个属性的解构赋值。注意，最后一次对 `line` 属性的解构赋值之中，只有 `line` 是变量，`loc` 和 `start` 都是模式，不是变量。

在解构赋值时，只要等号右边的值不是对象或数组，就先尝试将其转为对象。因此对字符串、数值、布尔值都可进行解构赋值。
```javascript
// 字符串解构赋值
const [a, b, c, d, e] = 'hello';// 字符串被转换成了一个类似数组的对象
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"

let {length : len} = 'hello';// 还可以对这个对象的属性解构赋值
len // 5

// 数值和布尔值的解构赋值
// 数值和布尔值的包装对象都有toString属性
let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true

// undefined和null无法转为对象，对它们进行解构赋值都会报错。
let { prop: x } = undefined; // TypeError
let { prop: y } = null; // TypeError
```
### 解构赋值的常见用途
#### 快速赋值

通过解构赋值，在需要将对象的多个属性赋值给多个参数时，可以很方便的实现。
```javascript
// 通过函数返回多个参数
function example() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example();

// 快速提取 JSON 数据值
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};
let { id, status, data: number } = jsonData;
console.log(id, status, number);// 42, "OK", [867, 5309]
```
#### 函数参数默认值

解构赋值可以方便的指定函数参数默认值。这样就无需在函数体内部再写 `var foo = config.foo || 'default foo';` 这样的语句。
```javascript
jQuery.ajax = function (url, {
  async = true,
  beforeSend = function () {},
  cache = true,
  complete = function () {},
  crossDomain = false,
  global = true,
  // ... more config
}) {
  // ... do stuff
};
```
#### 遍历Map结构

任何部署了 `Iterator` 接口的对象，都可以用 `for...of` 循环遍历。`Map` 结构原生支持 `Iterator` 接口，配合变量的解构赋值，获取键名和键值就非常方便。
```javascript
var map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map) {
  console.log(key + " is " + value);
}
// first is hello
// second is world
```
