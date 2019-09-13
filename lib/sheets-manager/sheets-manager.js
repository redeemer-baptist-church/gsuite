const ow = require('ow')
const {Spreadsheet} = require('./spreadsheet')

class SheetsManager {
  static get api() {
    return {name: 'sheets', version: 'v4'}
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

  async getSpreadsheet(spreadsheetId) {
    ow(spreadsheetId, ow.string)
    console.info(`GSuiteSheetsManager: getting spreadsheet '${spreadsheetId}'`)
    return this.connection.spreadsheets.get({spreadsheetId})
      .then(response => new Spreadsheet({data: response.data, manager: this}))
      .catch(e => this.error(e))
  }

  async getRange(options = {}) {
    ow(options, ow.object.exactShape({
      spreadsheetId: ow.string,
      range: ow.string,
      majorDimension: ow.string.optional,
      valueRenderOption: ow.string.optional,
      dateTimeRenderOption: ow.string.optional,
    }))
    console.info(`GSuiteSheetsManager: getting range '${options.range}' for spreadsheet '${options.spreadsheetId}'`)
    return this.connection.spreadsheets.values.get(options)
  }

  error(e) { // eslint-disable-line class-methods-use-this
    console.error(e)
    throw e
  }
}

module.exports = {SheetsManager}
