export {};

// 不推荐使用any, 会绕过类型校验
let a: any = 1;

// 不会绕过类型监测
let n: unknown;
n = 1;

if (typeof n == 'number') {
	n.toFixed(2);
} else if (typeof n == 'string') {
	n.concat('a');
}
