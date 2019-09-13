const {Client} = require('../client')
const {CalendarManager} = require('../calendar-manager')
const {GroupManager} = require('../group-manager')
const {PeopleManager} = require('../people-manager')
const {SheetsManager} = require('../sheets-manager')

class ManagerFactory {
  static async managerWithAuth(scopes, serviceAccount, managerClass, managerArgs) {
    const client = new Client(scopes, serviceAccount)
    const {api} = managerClass
    const connection = await client.buildConnection(api.name, api.version)
    const managerOptions = Object.assign({connection}, managerArgs)
    return new managerClass(managerOptions) // eslint-disable-line new-cap
  }

  static async calendarManager(scopes, serviceAccount) {
    return ManagerFactory.managerWithAuth(scopes, serviceAccount, CalendarManager)
  }

  static async groupManager(scopes, serviceAccount, managerArgs) {
    return ManagerFactory.managerWithAuth(scopes, serviceAccount, GroupManager, managerArgs)
  }

  static async peopleManager(scopes, serviceAccount) {
    return ManagerFactory.managerWithAuth(scopes, serviceAccount, PeopleManager)
  }

  static async sheetsManager(scopes, serviceAccount) {
    return ManagerFactory.managerWithAuth(scopes, serviceAccount, SheetsManager)
  }
}

module.exports = {ManagerFactory}
