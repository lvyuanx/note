export {};

// 枚举不是用来定义类型的，是用来列举数据的
enum StatusCode {
	ok = 200,
	error = 500,
	notFound = 404
}
let code: string | number = 200;
if (code == StatusCode.ok) {
	console.log('success');
} else if (code == StatusCode.error) {
	console.log('服务器内部错误');
} else if (code == StatusCode.notFound) {
	console.log('请求找不到');
}

enum StatusCode2 {
	ok, // 0
	error = 500, //500
	notFound // 501
}
