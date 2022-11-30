"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// | &
// && 优先于 ||
console.log(1 || (2 && 3)); // out: 1
// & 优先于 |
let obj;
obj = {
    name: 'zs',
    age: 18
};
obj = {
    name: 88,
    age: '18'
};
