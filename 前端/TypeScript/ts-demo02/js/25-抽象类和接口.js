"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 抽象类 是普通类的描述
class AbsPerson {
    setName(name) {
        this.name = name;
    }
}
// 普通类继承于抽象类
class Person extends AbsPerson {
    constructor() {
        super(...arguments);
        this.name = 'zs';
    }
    getName() {
        return this.name;
    }
}
let p = new Person();
p.setName('zs');
console.log(p.getName());
class PersonImpl {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
}
let p2 = new PersonImpl('sss');
console.log(p2.getName());
