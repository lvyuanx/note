# axios 学习路线

## 1、模拟后台请求

> 快速搭建REST风格http请求：[GitHub - typicode/json-server](https://github.com/typicode/json-server)

### 1.1 快速搭建

安装命令

```bash
npm install -g json-server
```

使用方法：

1. 准备db.json文件，用于数据的请求

   ```json
   {
     "posts": [
       { "id": 1, "title": "json-server", "author": "typicode" }
     ],
     "comments": [
       { "id": 1, "body": "some comment", "postId": 1 }
     ],
     "profile": { "name": "typicode" }
   }
   ```

   

2. 在json文件所在目录下启动Json-server服务

   启动命令

   ```bash
   json-server --watch db.json
   ```

   

### 1.2 请求方式

```
GET    /profile
POST   /profile
PUT    /profile
PATCH  /profile
```

== 更多请求方式参考Github官方：[GitHub - typicode/json-serve](https://github.com/typicode/json-server) ==

 

## 2、axios基本请求

### 2.1 Get请求

```js
axios({
    // 请求类型
    method: 'GET',
    // 请求地址
    url: 'url地址',
    param: {} // 请求参数，get请求，url地址拼接的方式
}).then(res => {
    // 响应体
})
```



### 2.2 Post请求

```js
axios({
    // 请求类型
    method: 'POST',
    // 请求地址
    url: 'url地址',
    param: {} ,// 请求参数，get请求，url地址拼接的方式
    data: {} , // requestBody中的参数，安全性高，可同时发送param和data两种类型参数
}).then(res => {
    // 响应体
})
```



### 2.3 Delete请求

```js
axios({
    // 请求类型
    method: 'DELETE',
    // 请求地址
    url: 'url地址',
    param: {} ,// 请求参数，get请求，url地址拼接的方式
    data: {} , // requestBody中的参数，安全性高，可同时发送param和data两种类型参数
}).then(res => {
    // 响应体
})
```



### 2.5 Put请求

```js
axios({
    // 请求类型
    method: 'PUT',
    // 请求地址
    url: 'url地址',
    param: {} ,// 请求参数，get请求，url地址拼接的方式
    data: {} , // requestBody中的参数，安全性高，可同时发送param和data两种类型参数
}).then(res => {
    // 响应体
})
```



### 2.5 文件上传

```js
let fromData = new FormData(); //创建form对象, 将form对象放到data中
      fromData.append("file", $("#file").files[0]); // 得到文件
      fromData.append("purpose", "avatar");  // 其他参数

axios({
    method: 'get',
    url: `url地址`,
    params: {},
    data: {},
    responseType: 'blob', // 响应数据为二进制流类型（文件类型）
    headers: { // 请求头信息
      'L-TOKEN': LToken, // 自定义Token
       'Content-Type': 'application/json', // 设置请求参数的类型，表单类型为application/x-www-form-urlencoded但是不支持文件格式
        
    }
}).then(res => {
    
})
```





### 2.5 文件下载

```js
axios({
    method: 'get',
    url: `url地址`,
    params: {},
    data: {},
    responseType: 'blob', // 响应数据为二进制流类型（文件类型）
    headers: { // 请求头信息
      'L-TOKEN': LToken, // 自定义Token
       'Content-Type': 'application/json', // 设置请求参数的类型，表单类型为application/x-www-form-urlencoded但是不支持文件格式
        
    }
}).then(res => {
    this.captchaImg = window.URL.createObjectURL(res); // 以图片为例，创建虚拟路径，显示图片
})
```







## 3、axios响应

示例

![image-20220304202657334](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20220304202657334.png)



## 4、axios配置

```js
{
  // `url` 是用于请求的服务器 URL
  url: '/user',

  // `method` 是创建请求时使用的方法
  method: 'get', // 默认值

  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: 'https://some-domain.com/api/',

  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 它只能用于 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 数组中最后一个函数必须返回一个字符串， 一个Buffer实例，ArrayBuffer，FormData，或 Stream
  // 你可以修改请求头。
  transformRequest: [function (data, headers) {
    // 对发送的 data 进行任意转换处理

    return data;
  }],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [function (data) {
    // 对接收的 data 进行任意转换处理

    return data;
  }],

  // 自定义请求头
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` 是与请求一起发送的 URL 参数
  // 必须是一个简单对象或 URLSearchParams 对象
  params: {
    ID: 12345
  },

  // `paramsSerializer`是可选方法，主要用于序列化`params`
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function (params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  // `data` 是作为请求体被发送的数据
  // 仅适用 'PUT', 'POST', 'DELETE 和 'PATCH' 请求方法
  // 在没有设置 `transformRequest` 时，则必须是以下类型之一:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属: FormData, File, Blob
  // - Node 专属: Stream, Buffer
  data: {
    firstName: 'Fred'
  },
  
  // 发送请求体数据的可选语法
  // 请求方式 post
  // 只有 value 会被发送，key 则不会
  data: 'Country=Brasil&City=Belo Horizonte',

  // `timeout` 指定请求超时的毫秒数。
  // 如果请求时间超过 `timeout` 的值，则请求会被中断
  timeout: 1000, // 默认值是 `0` (永不超时)

  // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false, // default

  // `adapter` 允许自定义处理请求，这使测试更加容易。
  // 返回一个 promise 并提供一个有效的响应 （参见 lib/adapters/README.md）。
  adapter: function (config) {
    /* ... */
  },

  // `auth` HTTP Basic Auth
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

  // `responseType` 表示浏览器将要响应的数据类型
  // 选项包括: 'arraybuffer', 'document', 'json', 'text', 'stream'
  // 浏览器专属：'blob'
  responseType: 'json', // 默认值

  // `responseEncoding` 表示用于解码响应的编码 (Node.js 专属)
  // 注意：忽略 `responseType` 的值为 'stream'，或者是客户端请求
  // Note: Ignored for `responseType` of 'stream' or client-side requests
  responseEncoding: 'utf8', // 默认值

  // `xsrfCookieName` 是 xsrf token 的值，被用作 cookie 的名称
  xsrfCookieName: 'XSRF-TOKEN', // 默认值

  // `xsrfHeaderName` 是带有 xsrf token 值的http 请求头名称
  xsrfHeaderName: 'X-XSRF-TOKEN', // 默认值

  // `onUploadProgress` 允许为上传处理进度事件
  // 浏览器专属
  onUploadProgress: function (progressEvent) {
    // 处理原生进度事件
  },

  // `onDownloadProgress` 允许为下载处理进度事件
  // 浏览器专属
  onDownloadProgress: function (progressEvent) {
    // 处理原生进度事件
  },

  // `maxContentLength` 定义了node.js中允许的HTTP响应内容的最大字节数
  maxContentLength: 2000,

  // `maxBodyLength`（仅Node）定义允许的http请求内容的最大字节数
  maxBodyLength: 2000,

  // `validateStatus` 定义了对于给定的 HTTP状态码是 resolve 还是 reject promise。
  // 如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，
  // 则promise 将会 resolved，否则是 rejected。
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 默认值
  },

  // `maxRedirects` 定义了在node.js中要遵循的最大重定向数。
  // 如果设置为0，则不会进行重定向
  maxRedirects: 5, // 默认值

  // `socketPath` 定义了在node.js中使用的UNIX套接字。
  // e.g. '/var/run/docker.sock' 发送请求到 docker 守护进程。
  // 只能指定 `socketPath` 或 `proxy` 。
  // 若都指定，这使用 `socketPath` 。
  socketPath: null, // default

  // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
  // and https requests, respectively, in node.js. This allows options to be added like
  // `keepAlive` that are not enabled by default.
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // `proxy` 定义了代理服务器的主机名，端口和协议。
  // 您可以使用常规的`http_proxy` 和 `https_proxy` 环境变量。
  // 使用 `false` 可以禁用代理功能，同时环境变量也会被忽略。
  // `auth`表示应使用HTTP Basic auth连接到代理，并且提供凭据。
  // 这将设置一个 `Proxy-Authorization` 请求头，它会覆盖 `headers` 中已存在的自定义 `Proxy-Authorization` 请求头。
  // 如果代理服务器使用 HTTPS，则必须设置 protocol 为`https`
  proxy: {
    protocol: 'https',
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // see https://axios-http.com/zh/docs/cancellation
  cancelToken: new CancelToken(function (cancel) {
  }),

  // `decompress` indicates whether or not the response body should be decompressed 
  // automatically. If set to `true` will also remove the 'content-encoding' header 
  // from the responses objects of all decompressed responses
  // - Node only (XHR cannot turn off decompression)
  decompress: true // 默认值

}
```





## 5、axios拦截器

```js
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });
```



示例

```js
import axios from 'axios'
import { getStore, setStore } from './storage'
import router from '../router/index'
import { Toast } from 'vant';
// 统一请求路径前缀
// const base = '/ccma-server/api'   // 服务器地址/
const base = '/api'   // 本地///
// 超时设定
axios.defaults.timeout = 15000

axios.interceptors.request.use(config => {
  return config
}, err => {
  Toast.fail('请求超时')
  return Promise.reject(err)
})


// http response 拦截器
axios.interceptors.response.use(response => {
  const data = response.data
  const msg = data.message
  // 根据返回的code值来做不同的处理(和后端约定)
  switch (data.code) {
    case 401:
      // 未登录 清除已登录状态
      setStore('L-Token', '')
      if (router.history.current.name !== '/') {
        router.replace('/')
        if (msg !== null) {
          Toast.fail(msg)
        } else {
          Toast.fail("登录失效，请重新登录")
        }
      }
      break
    case 403:
      // 没有权限
      if (msg !== null) {
        Toast.fail(msg)
      } else {
        Toast.fail("系统异常！")
      }
      break
    case 500:
      // 错误
      if (msg == null)  {
        Toast.fail("系统异常！")
      }
      break
    default:
      return data
  }

  return data
}, (err) => {
  // 返回状态码不为200时候的错误处理
  Toast.fail(err.toString())
  return Promise.resolve(err)
})

export const getRequest = (url, params, data) => {
  const LToken = getStore("L-Token")
  return axios({
    method: 'get',
    url: `${base}${url}`,
    params: params,
    data: data,
    headers: {
      'L-Token': LToken
    }
  })
}

export const postRequest = (url, params, data) => {
  const LToken = getStore("L-Token")
  return axios({
    method: 'post',
    url: `${base}${url}`,
    params: params,
    data: data,
    headers: {
      'Content-Type': 'application/json',
      'L-Token': LToken
    }
  })
}

export const putRequest = (url, params, data) => {
  const LToken = getStore("L-Token")
  return axios({
    method: 'put',
    url: `${base}${url}`,
    params: params,
    data: data,
    transformRequest: [function (data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/json',
      'L-Token': LToken
    }
  })
}

export const deleteRequest = (url, params, data) => {
  const LToken = getStore("L-Token")
  return axios({
    method: 'delete',
    url: `${base}${url}`,
    params: params,
    data: data,
    headers: {
      'L-TOKEN': LToken
    }
  })
}

export const importRequest = (url, params, data) => {
  const LToken = getStore("L-Token")
  return axios({
    method: 'post',
    url: `${base}${url}`,
    params: params,
    data: data,
    headers: {
      'L-TOKEN': LToken
    }
  })
}

export const uploadFileRequest = (url, data) => {
  const LToken = getStore("L-Token")
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: data,
    headers: {
      'L-TOKEN': LToken
    }
  })
}

export const IORequest = (url, params, data) => {
  const LToken = getStore("L-Token")
  return axios({
    method: 'get',
    url: `${base}${url}`,
    params: params,
    data: data,
    responseType: 'blob',
    headers: {
      'L-TOKEN': LToken
    }
  })
}
```

使用

```js
import {IORequest, postRequest, getRequest, uploadFileRequest } from './request'

// 用户登录
export const loginReq = (params, data) => {
  return postRequest('/author/user/login', params, data)
}
// 验证码
export const captchaReq = (params, data) => {
    return IORequest('/commons/captcha/default', params, data)
}
// 重复性请求
export const isRepeatReq = (params, data) => {
    return postRequest('/author/user/nameIsRepeat', params, data)
}

// 用户注册
export const registerReq = (params, data) => {
  return postRequest('/author/user/insertUser', params, data)
}

// 用户退出登录
export const logoutReq = (params, data) => {
  return getRequest('/author/user/logout', params, data)
}

// 查询用户登录信息
export const loginInfoReq = (params, data) => {
  return getRequest('/author/user/loginInfo', params, data)
}

// 用户密码修改
export const updatePasswordReq = (params, data) => {
  return postRequest('/author/user/updatePassword', params, data)
}

// 用户信息修改
export const updateUserInfoReq = (params, data) => {
  return postRequest('/author/user/updateUserInfo', params, data)
}

// 获取图片
export const getImageReq = (params, data) => {
  return IORequest('/commons/file/getImageForPath', params, data)
}

// 文件上传
export const uploadFileReq = (data) => {
  return uploadFileRequest('/commons/file/fileUpload', data)
}

// ====== 期，栋，单元，层，户统一接口=====start
// 添加
export const addReq = (url, params, data) => {
  return postRequest('/community/'+ url +'/add', params, data)
}

// 查询
export const findReq = (url , params, data) => {
  return getRequest('/community/'+ url +'/find', params, data)
}

// 查询所有
export const findAllReq = (url , params, data) => {
  return getRequest('/community/'+ url +'/findAll', params, data)
}
// ====== 期，栋，单元，层，户统一接口=====end

// 查询社区详情
export const findCommunityInfoReq = ( params, data) => {
  return getRequest('/community/period/findCommunityIno', params, data)
}

// 查询社区栋详情
export const findByPerionIdReq = ( params, data) => {
  return getRequest('/community/building/findByPerionId', params, data)
}

// 查询单元详情
export const findUnitInfoByBuindingReq = ( params, data) => {
  return getRequest('/community/unit/findUnitInfoByBuilding', params, data)
}

// 查询社区级联详情
export const findAllCommunityInfoReq = ( params, data) => {
  return getRequest('/community/period/findAllCommunityInfo', params, data)
}

// 绑定角色房间信息信息
export const bindRoleAndHouseholdReq = ( params, data) => {
  return postRequest('/author/user/bindRoleAndHousehold', params, data)
}


```

