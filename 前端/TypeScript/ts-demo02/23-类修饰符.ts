export {};

// 类里面定义的属性默认public
/**
 * public 公共的
 * protected 受保护的，类里面，子类可以访问，类外面不能访问
 * private 私有的，在本类中可以访问，子类和类外面不可以访问
 */
class Person {
	public readonly username: string = '默认名称';

	constructor(username?: string) {
		if (username) this.username = username;
	}

	public getName() {
		return this.username;
	}
}

class SystemPerson extends Person {
	private email: string;
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
