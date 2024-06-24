const path = require('path')
const fs = require('fs')

function getFolder(path) {
  const components = []
  const files = fs.readdirSync(path)
  files.forEach((item) => {
    const stat = fs.lstatSync(`${path}/${item}`)
    if (stat.isDirectory() === true && item !== 'components' && item !== 'modules') {
      components.push(`${path}/${item}`)
      components.push(...getFolder(`${path}/${item}`))
    }
  })
  return components
}

module.exports = {
  description: '创建页面',
  prompts: [
    {
      type: 'list',
      name: 'path',
      message: '请选择页面创建目录',
      choices: getFolder('src/views'),
    },
    {
      type: 'input',
      name: 'name',
      message: '请输入模块名(不含list)',
      validate: (v) => {
        if (!v || v.trim === '') {
          return '模块名不能为空'
        }
        else {
          return true
        }
      },
    },
    // {
    //   type: 'confirm',
    //   name: 'isFilesystem',
    //   message: '是否为基于文件系统的路由页面',
    //   default: false,
    // },
  ],
  actions: (data) => {
    const relativePath = path.relative('src/views', data.path)
    const actions = [
      {
        type: 'add',
        path: `${data.path}/{{properCase name}}List.vue`,
        templateFile: 'plop-templates/list/listVue.hbs',
        data: {
          componentName: `${data.name}List`,
        },
      },
    ]
    return actions
  },
}