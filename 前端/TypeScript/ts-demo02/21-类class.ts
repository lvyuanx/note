export {};

// 定义类的同时会创建一个相同名称的接口
class Person {
	username: string = '默认名称';

	constructor(username?: string) {
		if (username) this.username = username;
	}

	getName() {
		return this.username;
	}
}

let person = new Person('zs');
console.log(person.getName());

let obj: Person = {
	username: 'ss',
	getName() {
		return this.username;
	}
};
console.log(obj.getName());
