export {};

// 泛型-类型别名
type StrOrNum = string | number;
type ObjType<T> = {
	username: T;
	getName: () => T;
};

let obj: ObjType<StrOrNum> = {
	username: 'zs',
	getName() {
		return this.username;
	}
};

// 泛型-接口
interface IPerson<T = string> {
	name: T;
	getName: () => T;
}

let person: IPerson<StrOrNum> = {
	name: 'ss',
	getName() {
		return this.name;
	}
};

let person2: IPerson = {
	name: 'ss',
	getName() {
		return this.name;
	}
};
