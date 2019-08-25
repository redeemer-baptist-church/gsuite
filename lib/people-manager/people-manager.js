const ow = require('ow')

class PeopleManager {
  static get api() {
    return {name: 'people', version: 'v1'}
  }

  constructor(options) {
    ow(options, ow.object.exactShape({
      connection: ow.object,
    }))
    this.props = options
  }

  get connection() {
    return this.props.connection
  }

  async getContacts(options = {}) {
    const params = Object.assign(
      {
        resourceName: 'people/me',
        pageSize: 2000,
      },
      options,
    )
    ow(params, ow.object.hasKeys('resourceName', 'personFields'))
    console.info(`GSuitePeopleManager: getting contacts for ${params.resourceName}`)

    return this.connection.people.connections.list(params)
      .then(json => json.data.connections || [])
      .then(contacts => contacts.map(contact => ({
        resourceName: contact.resourceName,
        email: contact.emailAddresses[0].value,
        firstName: contact.names[0].givenName,
        lastName: contact.names[0].familyName,
        json: contact,
      })))
      .catch(e => this.error(e))
  }

  async createContacts(contacts) {
    ow(contacts, ow.array.ofType(ow.object))
    return contacts.map(contact => this.createContact(contact))
  }

  async createContact(contact = {}) {
    ow(contact, ow.object.hasKeys('email', 'firstName', 'lastName'))
    console.info(`GSuitePeopleManager: creating contact ${contact.email}`)
    return this.connection.people.createContact({
      requestBody: {
        emailAddresses: [{value: contact.email}],
        names: [{
          familyName: contact.lastName,
          givenName: contact.firstName,
        }],
      },
    }).catch(e => this.error(e))
  }

  async deleteContacts(resourceNames) {
    ow(resourceNames, ow.array.ofType(ow.string))
    return resourceNames.map(resourceName => this.deleteContact(resourceName))
  }

  async deleteContact(resourceName) {
    ow(resourceName, ow.string)
    console.info(`GSuitePeopleManager: deleting contact ${resourceName}`)
    return this.connection.people.deleteContact({resourceName})
      .catch(e => this.error(e))
  }

  error(e) { // eslint-disable-line class-methods-use-this
    console.error(e)
    throw e
  }
}

module.exports = {PeopleManager}
