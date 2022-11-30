export {};

class Person {
	username: string = '默认名称';

	constructor(username?: string) {
		if (username) this.username = username;
	}

	getName() {
		return this.username;
	}
}

class SystemPerson extends Person {
	email: string;
	constructor(username: string, email: string) {
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
