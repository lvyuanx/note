export {} // 导出为空，防止其他文件使用相同变量名而冲突

let str = "a";
console.log(str);
const num = 1; // 常量不能改变指向（不能被修改），所以他的值就是他的类型

// js原始类型：number string boolean undefined null symbol
// TS原始类型： 
let str1:string = "1" ;
let bool:boolean = false;
let num1: number = 1;
let nud:undefined = undefined;
let nul:null = null;
let sy:symbol = Symbol("123")
let vo:void = undefined;