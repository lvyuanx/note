"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 枚举不是用来定义类型的，是用来列举数据的
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["ok"] = 200] = "ok";
    StatusCode[StatusCode["error"] = 500] = "error";
    StatusCode[StatusCode["notFound"] = 404] = "notFound";
})(StatusCode || (StatusCode = {}));
let code = 200;
if (code == StatusCode.ok) {
    console.log('success');
}
else if (code == StatusCode.error) {
    console.log('服务器内部错误');
}
else if (code == StatusCode.notFound) {
    console.log('请求找不到');
}
var StatusCode2;
(function (StatusCode2) {
    StatusCode2[StatusCode2["ok"] = 0] = "ok";
    StatusCode2[StatusCode2["error"] = 500] = "error";
    StatusCode2[StatusCode2["notFound"] = 501] = "notFound"; // 501
})(StatusCode2 || (StatusCode2 = {}));
