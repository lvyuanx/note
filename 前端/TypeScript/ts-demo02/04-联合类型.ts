export {};

// | 联合类型
let numOrBool: number | boolean = 1;
numOrBool = false;

let numOrBool2: 1 | true = 1;

numOrBool2 = true;

// 限定obj对象内只能有a属性或者b属性
let obj: { a: 1 } | { b: number } = { a: 1 };
obj = { a: 1, b: 2 };
