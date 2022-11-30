export {};

// 不使用泛型
function func1(n: number | boolean): number | boolean {
	return n;
}
func1(1);
func1(false);

// 使用泛型
function func2<T, V>(n: T, m?: V): T {
	return n;
}

func2<number, undefined>(1);
func2<boolean, string>(false, 'aaa');
