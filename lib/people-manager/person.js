const ow = require('ow')

class Person {
  constructor(options = {}) {
    ow(options, ow.object.exactShape({
      json: ow.object,
    }))
    this.props = options
  }

  get json() {
    return this.props.json
  }

  get resourceName() {
    return this.json.resourceName
  }

  get email() {
    return this.json.emailAddresses[0].value
  }

  get firstName() {
    return this.json.names[0].givenName
  }

  get lastName() {
    return this.json.names[0].familyName
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

module.exports = {Person}
