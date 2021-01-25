const when = (condition, value, fallback) => (condition ? value : fallback)
const commands = cmds => cmds.filter(Boolean).join(' && ') || undefined

module.exports = (
  {
    eslint,
    unitTest,
    compile,
    language,
    name,
    coverage,
    description,
    username,
    email
  },
  data
) => {
  const useLinter = eslint !== 'disabled'
  const useXo = eslint === 'xo'
  const useStandard = eslint === 'standard'
  const useTS = language === 'ts'

  return {
    name,
    version: '0.0.0',
    description,
    main: when(compile, `dist/${name}.cjs.js`, 'index.js'),
    module: when(compile, `dist/${name}.esm.js`),
    browser: when(compile, `dist/${name}.umd.js`),
    files: when(
      compile,
      ['dist'],
      ['src/**']
    ),
    scripts: {
      'test:cov': when(coverage, commands([
        when(useLinter, 'npm run lint'),
        'jest --coverage'
      ])),
      test: commands([
        when(useLinter, 'npm run lint'),
        'jest'
      ]),
      pretest: when(useLinter, 'npm run build'),
      lint: when(useLinter, eslint),
      prepublishOnly: when(compile, 'npm run build'),
      build: when(compile, 'rollup -c'),
      watch: when(compile, 'rollup -c -w')
    },
    repository: {
      url: `${username}/${name}`,
      type: 'git'
    },
    author: `${username}<${email}>`,
    license: 'MIT',
    dependencies: {
    },
    devDependencies: {
      xo: when(useXo, '^0.23.0'),
      'eslint-config-rem': when(useXo, '^4.0.0'),
      prettier: when(useLinter, '^1.15.2'),
      'eslint-config-prettier': when(useXo, '^3.3.0'),
      'eslint-plugin-prettier': when(useXo, '^3.0.0'),
      standard: when(useStandard, '^12.0.0'),
      jest: when(unitTest, '^23.6.0'),
      'lint-staged': '^7.2.0',
      husky: '^1.0.0-rc.13',
      rollup: '^1.0.0',
      "rollup-plugin-commonjs": "^9.2.0",
      "rollup-plugin-node-resolve": "^4.0.0",
      typescript: when(useTS, "^4.1.3"),
      "@babel/core": when(compile, "^7.2.2"),
      "@babel/preset-env": when(compile, "^7.2.3"),
      "@babel/preset-typescript": when(useTS, "^7.12.7"),
      "rollup-plugin-babel": when(compile, "^4.2.0")
    },
    jest: when(unitTest, {
      testEnvironment: 'node'
    }),
    xo: when(useXo, {
      extends: ['rem', 'plugin:prettier/recommended'],
      envs: when(unitTest, ['jest'])
    }),
    husky: {
      hooks: {
        'pre-commit': 'lint-staged'
      }
    },
    'lint-staged': {
      '*.js': when(useLinter, [`${eslint} --fix`, 'git add']),
      [when(useLinter, '*.{json,md}', '*.{js,json,md}')]: [
        'prettier --write',
        'git add'
      ]
    }
  }
}
