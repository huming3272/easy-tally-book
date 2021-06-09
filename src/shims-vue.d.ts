declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
declare module '*.svg' {
  const content: string;
  export default content;
}
// 声明svg模块并导出，用于外部引入svg
