export {};

// 加了export{}, 这里就不是全局了，这里扩展的Window接口就无效了

function Person(this: Window, name: string) {
	// 在ts的书写中，需要指明this的指向。在函数的第一个形参位置注明
	// Window类型中没有username这个属性，需要自己扩展下这个类
	this.username = name;
}

window.Person = Person;
window.Person('zs');
