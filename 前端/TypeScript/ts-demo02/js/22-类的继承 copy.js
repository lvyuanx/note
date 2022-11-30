"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
