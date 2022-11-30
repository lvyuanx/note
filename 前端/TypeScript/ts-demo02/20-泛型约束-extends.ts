export {};

interface IPerson<T extends string | number = string> {
	username: T;
	getName: () => T;
}

let person: IPerson<string> = {
	username: 'ls',
	getName() {
		return this.username;
	}
};
