<%_ if (compile) { -%>
import <%= this.camelcase(name) %> from '../'
<%_ } else { -%>
const <%= this.camelcase(name) %> = require('../')
<%_ } -%>

test('main', () => {
  expect(typeof <%= this.camelcase(name) %>.add).toBe('function')
})
