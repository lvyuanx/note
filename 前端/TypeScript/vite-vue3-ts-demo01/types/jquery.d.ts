declare function $(n: string): any;
declare namespace $ {
  function ajax(): void;
}

// npm i --saave-dev @type/jquery
// @type/jquery 是市面上已经写好的针对jquery的ts类型的声明
// --save-dev  表示是项目依赖
// -D 表示是开发环境依赖
