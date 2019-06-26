const ow = require('ow')

class CalendarManager {
  constructor(options = {}) {
    ow(options, ow.object.exactShape({
      connection: ow.object,
    }))
    this.props = options
  }

  get connection() {
    return this.props.connection
  }

  async getCalendars(options = {}) {
    console.info('GSuiteCalendarManager: getting calendars')
    ow(options, ow.optional.object)
    const params = Object.assign(
      {maxResults: 100},
      options,
    )

    return this.connection.calendarList.list(params)
      .then(json => json.data.items || [])
      .catch(e => this.error(e))
  }

  async getEvents(params = {}) {
    ow(params, ow.object.hasKeys('calendarId'))
    console.info(`GSuiteCalendarManager: getting events for calendar ${params.calendarId}`)
    return this.connection.events.list(params)
      .then(json => json.data.items || [])
      .catch(e => this.error(e))
  }

  error(e) { // eslint-disable-line class-methods-use-this
    console.error(e)
    throw e
  }
}

module.exports = {CalendarManager}
