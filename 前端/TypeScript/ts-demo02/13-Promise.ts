export {};

// 定义Promise返回值的类型
interface IRes {
	code: number;
	data: object;
	msg: string;
}

let p: Promise<IRes> = new Promise((resolve, reject) => {
	resolve({
		code: 200,
		msg: 'success',
		data: []
	});
});

p.then(res => {
	if (res.code == 200) {
		console.log(res);
	}
});
