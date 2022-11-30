"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 不使用泛型
function func1(n) {
    return n;
}
func1(1);
func1(false);
// 使用泛型
function func2(n, m) {
    return n;
}
func2(1);
func2(false, 'aaa');
