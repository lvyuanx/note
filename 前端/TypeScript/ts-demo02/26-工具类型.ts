export {};

interface IPerson {
	username: string;
	age: number;
	height?: number;
}

// 使用Partial相当于可以只使用泛型的部分属性，将泛型内的属性设置为可缺省的
// type Partial<T> = { [P in keyof T]?: T[P] | undefined; }
let obj: Partial<IPerson> = {
	username: 'zs'
};

// 使用Required相当于把泛型里面的属性变为不可缺省
// type Required<T> = { [P in keyof T]-?: T[P]; }
let obj2: Required<IPerson> = {
	username: 'zs',
	age: 18,
	height: 186
};
