const {Client} = require('../client')
const {CredentialsFactory} = require('./credentials-factory')
const {CalendarManager} = require('../calendar-manager')
const {GroupManager} = require('../group-manager')
const {PeopleManager} = require('../people-manager')
const {SheetsManager} = require('../sheets-manager')

class ManagerFactory {
  static async managerWithAuth(scopes, managerClass, managerArgs) {
    const credentials = await CredentialsFactory.loadRedeemerBaptistChurchCredentials()
    const client = new Client(scopes, credentials)
    const {api} = managerClass
    const connection = await client.buildConnection(api.name, api.version)
    const managerOptions = Object.assign({connection}, managerArgs)
    return new managerClass(managerOptions) // eslint-disable-line new-cap
  }

  static async calendarManager(scopes) {
    return ManagerFactory.managerWithAuth(scopes, CalendarManager)
  }

  static async groupManager(scopes, managerArgs) {
    return ManagerFactory.managerWithAuth(scopes, GroupManager, managerArgs)
  }

  static async peopleManager(scopes) {
    return ManagerFactory.managerWithAuth(scopes, PeopleManager)
  }

  static async sheetsManager(scopes) {
    return ManagerFactory.managerWithAuth(scopes, SheetsManager)
  }
}

module.exports = {ManagerFactory}
