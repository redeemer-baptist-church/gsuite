const ow = require('ow')

class Event {
  constructor(options = {}) {
    ow(options, ow.object.exactShape({
      properties: ow.object.partialShape({
        summary: ow.string,
        start: ow.object.exactShape({
          dateTime: ow.string,
        }),
        end: ow.object.exactShape({
          dateTime: ow.string,
        }),
        attendees: ow.optional.array.ofType(
          ow.object.partialShape({
            email: ow.string,
          }),
        ),
      }),
      calendar: ow.object,
    }))

    options.properties.attendees = options.properties.attendees || [] // eslint-disable-line no-param-reassign
    this.props = options
  }

  get properties() {
    return this.props.properties
  }

  get id() {
    return this.properties.id
  }

  get calendar() {
    return this.props.calendar
  }

  get calendarId() {
    return this.calendar.id
  }

  get label() {
    return this.properties.summary
  }

  get description() {
    return this.properties.description
  }

  get start() {
    return this.properties.start.dateTime
  }

  get end() {
    return this.properties.end.dateTime
  }

  get attendees() {
    return this.properties.attendees.map(a => a.email)
  }

  async createEvent(params = {}) {
    ow(params, ow.optional.object)
    return this.calendar.createEvent(Object.assign(params, {resource: this.properties}))
  }

  async deleteEvent(params = {}) {
    ow(params, ow.optional.object)
    return this.calendar.deleteEvent(Object.assign(params, {eventId: this.id}))
  }

  async updateEvent(params = {}) {
    ow(params, ow.object.partialShape({
      resource: ow.object,
    }))
    this.props.properties = Object.assign(this.props.properties, params.resource)
    return this.calendar.updateEvent(Object.assign(params, {eventId: this.id, resource: this.properties}))
  }
}

module.exports = {Event}
