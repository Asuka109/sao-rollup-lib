const superb = require('superb')
const camelcase = require('camelcase')

module.exports = {
  description: 'Scaffolding out a rollup module.',
  transformerOptions: {
    context: {
      camelcase
    }
  },
  prompts() {
    return [
      {
        name: 'name',
        message: 'What is the name of the new project',
        default: this.outFolder,
        filter: val => val.toLowerCase()
      },
      {
        name: 'description',
        message: 'How would you descripe the new project',
        default: `my ${superb()} project`
      },
      {
        name: 'username',
        message: 'What is your GitHub username',
        default: this.gitUser.username || this.gitUser.name,
        filter: val => val.toLowerCase(),
        store: true
      },
      {
        name: 'email',
        message: 'What is your email?',
        default: this.gitUser.email,
        store: true
      },
      {
        name: 'website',
        message: 'The URL of your website',
        default({ username }) {
          return `github.com/${username}`
        },
        store: true
      },
      {
        name: 'compile',
        message: 'Do you need to compile code with babel',
        type: 'confirm',
        default: false
      },
      {
        name: 'language',
        message: 'What language do you want to use',
        type: 'list',
        choices: [
          { name: 'JavaScript', value: 'js' },
          { name: 'TypeScript', value: 'ts' }
        ],
        default: 'js',
        when: 'compile'
      },
      {
        name: 'packageManager',
        message: 'Package manager',
        type: 'list',
        choices: [
          'Yarn',
          'Npm'
        ]
      },
      {
        name: 'unitTest',
        message: 'Do you need unit test',
        type: 'confirm',
        default: false
      },
      {
        name: 'coverage',
        message: 'Do you want to add test coverage support',
        type: 'confirm',
        default: false,
        when: answers => answers.unitTest
      },
      {
        name: 'eslint',
        message: 'Choose an ESLint tool',
        type: 'list',
        default: 'xo',
        choices: ['xo', 'standard', 'disabled']
      },
    ]
  },
  actions() {
    return [
      {
        type: 'add',
        files: '**',
        filters: {
          'test/**': 'unitTest',
          'src-javascript/**': 'language === "js"',
          'src-typescript/**': 'language === "ts"',
          'index.js': '!compile'
        }
      },
      {
        type: 'move',
        patterns: {
          // We keep `.gitignore` as `gitignore` in the project
          // Because when it's published to npm
          // `.gitignore` file will be ignored!
          gitignore: '.gitignore',
          'src-*/': 'src/',
          '_package.json': 'package.json'
        }
      },
      {
        type: 'modify',
        files: 'package.json',
        handler: data => require('./lib/update-pkg')(this.answers, data)
      }
    ]
  },
  async completed() {
    await this.gitInit()
    await this.npmInstall({ packageManager: this.answers.pm })
    this.showProjectTips()
  }
}
