export {};

// 抽象类 是普通类的描述
abstract class AbsPerson {
	abstract name: string;
	abstract getName(): string;
	setName(name: string) {
		this.name = name;
	}
}

// 普通类继承于抽象类
class Person extends AbsPerson {
	name: string = 'zs';
	getName() {
		return this.name;
	}
}

let p = new Person();
p.setName('zs');
console.log(p.getName());

// 定义接口
interface IPerson {
	name: string;
	getName: () => string;
}

class PersonImpl implements IPerson {
	name: string;
	constructor(name: string) {
		this.name = name;
	}

	getName() {
		return this.name;
	}
}

let p2 = new PersonImpl('sss');
console.log(p2.getName());
