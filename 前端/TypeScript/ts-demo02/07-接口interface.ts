export {};

// interface 定义接口类型
// 定义接口类型——给对象用
interface MyInf {
	// 属性名称: 属性值
	name: string;
	age: number;
}

let obj: MyInf = {
	name: 'zs',
	age: 18
};

// 定义接口类型——给数组用
interface ArrInf {
	// [下标类型]: 值类型
	[idx: number]: number | string;
}

let arr: ArrInf = [1, '2'];

// 定义接口——给函数用
interface FnInf {
	// (形参及类型): 返回值类型
	(p: string): void;
}
let func: FnInf = (name: string) => {
	console.log('name', name);
};
