const ow = require('ow')
const {Calendar} = require('./calendar')
const {Event} = require('./event')

class CalendarManager {
  static get api() {
    return {name: 'calendar', version: 'v3'}
  }

  constructor(options = {}) {
    ow(options, ow.object.exactShape({
      connection: ow.object,
    }))
    this.props = options
  }

  get connection() {
    return this.props.connection
  }

  async getCalendar(calendarId) {
    console.info(`GSuiteCalendarManager: getting calendar '${calendarId}'`)
    ow(calendarId, ow.string)

    return this.connection.calendars.get({calendarId})
      .then(response => new Calendar({data: response.data, manager: this}))
      .catch(e => this.error(e))
  }

  async getCalendars(options = {}) {
    console.info('GSuiteCalendarManager: getting calendars')
    ow(options, ow.optional.object)
    const params = Object.assign(
      {maxResults: 100},
      options,
    )

    return this.connection.calendarList.list(params)
      .then(json => (json.data.items || [])
        .map(item => new Calendar({data: item, manager: this})))
      .catch(e => this.error(e))
  }

  async getEvents(params = {}) {
    ow(params, ow.object.partialShape({
      calendarId: ow.string,
    }))
    console.info(`GSuiteCalendarManager: getting events for calendar ${params.calendarId}`
       + ` between '${params.timeMin}' and '${params.timeMax}'`)
    const calendar = new Calendar({
      data: {
        id: params.calendarId,
      },
      manager: this,
    })
    return this.connection.events.list(params)
      .then(json => (json.data.items || []).map(e => new Event({properties: e, calendar})))
      .catch(e => this.error(e))
  }

  async createEvent(params) {
    ow(params, ow.object.partialShape({
      calendarId: ow.string,
      resource: ow.object,
    }))
    const event = params.resource
    const eventLabel = `${event.summary} - ${event.start.dateTime} - ${event.end.dateTime} - ${event.attendees.map(a => a.email).sort()}`
    console.info(`GSuiteCalendarManager: creating event '${eventLabel}' for calendar '${params.calendarId}'`)
    return this.connection.events.insert(params)
      .catch(e => this.error(e))
  }

  async deleteEvent(params) {
    ow(params, ow.object.partialShape({
      calendarId: ow.string,
      eventId: ow.string,
    }))
    console.info(`GSuiteCalendarManager: deleting event '${params.eventId}' for calendar '${params.calendarId}'`)
    return this.connection.events.delete(params)
      .catch(e => this.error(e))
  }

  async updateEvent(params) {
    ow(params, ow.object.partialShape({
      calendarId: ow.string,
      eventId: ow.string,
      resource: ow.object,
    }))
    const event = params.resource
    const eventLabel = `${event.summary} - ${event.start.dateTime} - ${event.end.dateTime} - ${event.attendees.map(a => a.email).sort()}`
    console.info(`GSuiteCalendarManager: updating event '${eventLabel}' for calendar '${params.calendarId}'`)
    return this.connection.events.update(params)
      .catch(e => this.error(e))
  }

  error(e) { // eslint-disable-line class-methods-use-this
    console.error(e)
    throw e
  }
}

module.exports = {CalendarManager}
