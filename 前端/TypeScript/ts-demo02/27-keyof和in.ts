export {};

interface IPerson {
	name: string;
	age: number;
	[idx: number]: number | string;
	[idx: string]: number | string;
}

type PType = keyof IPerson; // 'name' | 'age' | number | string

let p1: PType = 'name';
console.log(p1);
let p2: PType = 1;
let p3: PType = 'hahaha';

type StringOrNumber = string | number;
type TP = {
	[k in StringOrNumber]: string;
};

let obj1: TP = {
	zs: 'zs',
	1: '1'
};

// typeof 提取变量或者对象的类型
let str = '123';
type typeofStr = typeof str;
let aaa: typeofStr = 'zs';

let obj = {
	name: '',
	age: 18
};
type typeofObj = typeof obj;
let obj2: typeofObj = {
	name: 'zs',
	age: 25
};
