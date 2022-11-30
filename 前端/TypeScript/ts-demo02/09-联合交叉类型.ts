export {};

// | &

// && 优先于 ||
console.log(1 || (2 && 3)); // out: 1

// & 优先于 |
let obj: ({ name: string } & { age: number }) | ({ name: number } & { age: string });

obj = {
	name: 'zs',
	age: 18
};

obj = {
	name: 88,
	age: '18'
};
