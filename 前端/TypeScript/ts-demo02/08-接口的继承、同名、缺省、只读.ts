export {};

interface IName {
	readonly name: string; // readonly 表示该属性只读（初始化后无法修改）
}

interface IAge {
	age?: number; // ?表示缺省，可以省掉该属性
}

// 继承，具有父接口的属性类型
interface IPerson extends IName, IAge {
	email: string;
}

let p: IPerson = {
	name: 'zs',
	age: 18,
	email: '123@qq.com'
};

// p.name = "ss" // 无法分配到 "name" ，因为它是只读属性。

// 接口可以同名，表示合并了相同名称接口的属性
interface IA {
	name: string;
}
interface IA {
	age: number;
}

let a: IA = {
	name: 'zs',
	age: 18
};
