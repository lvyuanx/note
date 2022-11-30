export {};

// 自定义一个类型
type StrOrNum = string | number;

let str: StrOrNum = '1';
str = 1;

type ObjType = {
	a: number;
	b: string;
};

let obj: ObjType = {
	a: 1,
	b: 'a'
};

// interface和type异同点：
/**
 * 都可以用来定义类型
 * 类型别名支持联合和交叉类型定义
 * 类型别名不支持重复定义，接口可以
 */

// interface和Type混合使用
interface IA {
	a: string;
}

type AType = IA['a'];
let a: AType = 'a';
