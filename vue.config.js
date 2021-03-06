// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    const dir = path.resolve(__dirname, 'src/assets/icons')
    config.module
        .rule('svg-sprite')
        .test(/\.svg$/)
        .include.add(dir).end()//包括icons目录
        .use('svg-sprite-loader').loader('svg-sprite-loader').options({extract: false}).end()
        .use('svgo-loader').loader('svgo-loader')
        .tap(options => ({...options, plugins: [{removeAttrs: {attrs: 'fill'}}]})).end()
    //    动态移除了svg的fill属性防止css的color不生效
    config.plugin('svg-sprite').use(
// eslint-disable-next-line @typescript-eslint/no-var-requires
        require('svg-sprite-loader/plugin')
        , [{plainSprite: true}])
    config.module.rule('svg').exclude.add(dir) //其他 svg loader 排除icons目录
  },
  publicPath: process.env.NODE_ENV === 'production'
      ? '/easy-tally-book/'
      : '/'

}
