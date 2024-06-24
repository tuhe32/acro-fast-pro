module.exports = function (plop) {
  // plop generator code
  // 基本vue3文件生成器
  plop.setWelcomeMessage('请选择需要创建的模式：')
  plop.setGenerator('list', require('./plop-templates/list/prompt'))
  plop.setGenerator('detail', require('./plop-templates/detail/prompt'))
  plop.setGenerator('component', require('./plop-templates/component/prompt'))

};