"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 定义类的同时会创建一个相同名称的接口
class Person {
    constructor(username) {
        this.username = '默认名称';
        if (username)
            this.username = username;
    }
    getName() {
        return this.username;
    }
}
let person = new Person('zs');
console.log(person.getName());
let obj = {
    username: 'ss',
    getName() {
        return this.username;
    }
};
console.log(obj.getName());
