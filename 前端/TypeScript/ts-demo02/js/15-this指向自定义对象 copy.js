"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let obj = {
    username: 'zs',
    person: (str) => { }
};
function Person(name) {
    this.username = name;
}
obj.person = Person;
obj.person('a');
console.log(obj.username);
