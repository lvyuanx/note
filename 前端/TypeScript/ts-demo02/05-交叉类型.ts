export {};

// & 交叉类型

let a: number & string; // 不会有任何类型的值满足这个，一般不会这么写

// obj必须同时拥有name, age属性
let obj: { name: string } & { age: number };
obj = { name: 'zs', age: 18 };
