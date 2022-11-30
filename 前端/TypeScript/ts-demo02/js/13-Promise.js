"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let p = new Promise((resolve, reject) => {
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
