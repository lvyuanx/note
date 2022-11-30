// 再TS中提供了Window类型接口，这里使用相同名目，相当于合并了属性
// 必须定义到全局上，才能使用
interface Window {
	Person: (name: string) => void;
	username: string;
}
