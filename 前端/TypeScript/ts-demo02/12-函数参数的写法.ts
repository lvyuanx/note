export {};

// 默认参数
function func1(a: number, b: number = 0): number {
	return a + b;
}

let a = func1(1, 2);
let b = func1(1);

// 缺省参数
function func2(a: number, b?: number) {
	console.log(a);
}

func2(1, 2);
func2(1);

// 剩余参数
function func3(...arr: Array<string>) {}

func3('1', 'e', 'ss');

// 结构后修改，基本数据类型深拷贝，数组浅拷贝
let arr1 = [1, 2, 3];
let arr2 = [...arr1];
arr1[1] = 0;
console.log(arr1); // out：[1,0,3]
console.log(arr2); // out：[1,2,3]

let obj1 = { a: 1, b: [100, 200] };
let obj2 = { ...obj1 };
obj1.a = 2;
obj1.b[0] = 0;
console.log(obj1); // out: {a:2, b: [0, 200]}
console.log(obj2); // out: {a:1, b: [0, 200]}
