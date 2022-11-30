"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 类里面定义的属性默认public
/**
 * public 公共的
 * protected 受保护的，类里面，子类可以访问，类外面不能访问
 * private 私有的，在本类中可以访问，子类和类外面不可以访问
 */
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
Person.title = 'hahaha';
class SystemPerson extends Person {
    constructor(username, email) {
        super(username); // 调用父类的构造方法
        this.email = email;
    }
    getEmail() {
        return this.email;
    }
}
let systemPerson = new SystemPerson('ZS', 'XXX@XX.COM');
console.log(systemPerson.getEmail());
console.log(systemPerson.getName());
Person.title = 'hello world'; // 修改静态属性的值
console.log(Person.title);
