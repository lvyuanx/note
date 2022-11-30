"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let obj = {
    username: 'zs',
    person: (str) => { }
};
// 多种类型可以让this去指向
function Person(name) {
    this.username = name;
}
obj.person = Person;
obj.person('a');
console.log(obj.username);
window.Person = Person;
window.Person('b');
console.log(window.username);
