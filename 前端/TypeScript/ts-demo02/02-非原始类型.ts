export {}

let obj:object = {a:1};
let arr:object = [1];

// object 不包含基础数据类型
// let number:object = 1; // 不能将类型“number”分配给类型“object”
// let str:object = '1'; // 不能将类型“string”分配给类型“object”

// Object 包含基础数据类型
let obj1:Object = {a:1};
let arr1:Object = [];
let num:Object = 1;
let str:Object = '1';
let bool:Object = false;

// Object 的效果等同于 {}
let obj2:{} = {a:1};
let arr2:{} = [];
let num2:{} = 1;
let str2:{} = '1';
let bool2:{} = false;