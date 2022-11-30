export {};

type ObjectType = {
	username: string;
	person: (str: string) => void;
};

let obj: ObjectType = {
	username: 'zs',
	person: (str: string) => {}
};

function Person(this: ObjectType, name: string) {
	this.username = name;
}

obj.person = Person;
obj.person('a');
console.log(obj.username);
