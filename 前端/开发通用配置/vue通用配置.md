# Vue3通用配置

## 1. 配置项目路径别名@

1. 配置vscode中使用@符号会提示路径

   打开vscode -> 设置 ->打开设置(json) 进入settings.json, 在settings.json中假如如下配置

   ```json
   "path-intellisense.mappings": {
       "@": "${workspaceRoot}/src", // 配置@符号表示的路径
    },
   ```

   ![image-20221203221727520](vue通用配置.assets/image-20221203221727520.png) 

   

2.  配置TS中@符号的作用，让其不会出现红色波浪线

   在项目的tsconfig.json中加入如下配置

   ```json
   "compilerOptions": {
   	...
       "baseUrl": "./",
       "paths": {
         "@/*": [
           "src/*"
         ],
         "#/*": [
           "types/*"
         ]
       }
     },
   ```

   

3.  配置vite在打包的时候，自动将@符号转换成对应的路径

   ```shell
   npm i -D @types/node
   ```

   在项目的vite.config.ts中假如如下配置

   ```json
   import * as path from "path";
   
   export default defineConfig({
     resolve: {
       alias: {
         "@": path.join(__dirname, "src"),
         "#": path.join(__dirname, "types"),
       },
     },
   });
   ```

   