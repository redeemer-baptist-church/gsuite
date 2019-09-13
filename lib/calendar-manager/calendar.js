const ow = require('ow')

class Calendar {
  constructor(options = {}) {
    ow(options, ow.object.exactShape({
      data: ow.object,
      manager: ow.object,
    }))
    this.props = options
  }

  get id() {
    return this.props.data.id
  }

  get manager() {
    return this.props.manager
  }

  get summary() {
    return this.props.data.summary
  }

  async getEvents(params = {}) {
    ow(params, ow.optional.object)
    return this.manager.getEvents(Object.assign(
      {
        calendarId: this.id,
      },
      params,
    ))
  }

  async createEvent(params) {
    ow(params, ow.object.partialShape({
      resource: ow.object,
    }))
    return this.manager.createEvent(Object.assign(params, {calendarId: this.id}))
  }

  async deleteEvent(params) {
    ow(params, ow.object.partialShape({
      eventId: ow.string,
    }))
    return this.manager.deleteEvent(Object.assign(params, {calendarId: this.id}))
  }

  async updateEvent(params) {
    ow(params, ow.object.partialShape({
      eventId: ow.string,
    }))
    return this.manager.updateEvent(Object.assign(params, {calendarId: this.id}))
  }

  error(e) { // eslint-disable-line class-methods-use-this
    console.error(e)
    throw e
  }
}

module.exports = {Calendar}
