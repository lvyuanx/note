"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// | 联合类型
let numOrBool = 1;
numOrBool = false;
let numOrBool2 = 1;
numOrBool2 = true;
// 限定obj对象内只能有a属性或者b属性
let obj = { a: 1 };
obj = { a: 1, b: 2 };
