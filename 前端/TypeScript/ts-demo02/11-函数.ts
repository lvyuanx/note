export {};

function func1(a: number, b: number) {
	return a + b;
}

// 定义接口类型函数
interface IFunc {
	(p: string): string;
}

let func2: IFunc = (p: string) => {
	return p;
};

// 定义Type类型函数
type TypeFunc = (p: string) => void;
let func3: TypeFunc = (p: string) => {};

// 定义对象内的函数
interface IObj {
	func: IFunc;
}

let obj: IObj = {
	func: (p: string) => {
		return p;
	}
};

type ObjType = { func: (p: string) => void };
let obj2: ObjType = {
	func: (p: string) => {}
};
