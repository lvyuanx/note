export {};

type ObjectType = {
	username: string;
	person: (str: string) => void;
};

let obj: ObjectType = {
	username: 'zs',
	person: (str: string) => {}
};

// 多种类型可以让this去指向
function Person(this: ObjectType | Window, name: string) {
	this.username = name;
}

obj.person = Person;
obj.person('a');
console.log(obj.username);

window.Person = Person;
window.Person('b');
console.log(window.username);
