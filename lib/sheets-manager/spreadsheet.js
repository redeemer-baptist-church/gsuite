const ow = require('ow')
const {Sheet} = require('./sheet')

class Spreadsheet {
  constructor(options = {}) {
    ow(options, ow.object.exactShape({
      data: ow.object,
      manager: ow.object,
    }))
    this.props = options
  }

  get spreadsheetId() {
    return this.props.data.spreadsheetId
  }

  get manager() {
    return this.props.manager
  }

  get data() {
    return this.props.data
  }

  getSheet(sheetId) {
    console.log(`GSuiteSheetsManager: getting sheet '${sheetId}' for spreadsheet '${this.spreadsheetId}`)
    // TODO: validation that said sheetId exists in this.data.sheets
    return new Sheet({
      json: this.data.sheets[sheetId],
      spreadsheet: this,
    })
  }

  async getRange(range) {
    return this.manager.getRange({
      spreadsheetId: this.spreadsheetId,
      range,
    })
  }

  async getAllCells(sheetName) {
    ow(sheetName, ow.string)
    console.info(`GSuiteSheetsManager: getting all cells for sheet '${sheetName}'`
                 + ` in spreadsheet '${this.spreadsheetId}'`)
    return this.getRange(sheetName)
  }

  async getColumn(options = {}) {
    ow(options, ow.object.exactShape({
      sheetName: ow.string,
      columnId: ow.string,
    }))
    console.info(`GSuiteSheetsManager: getting column '${options.columnId}'`
                  + ` for sheet '${options.sheetName}' in spreadsheet '${this.spreadsheetId}'`)
    return this.getRange(`${options.sheetName}!${options.columnId}:${options.columnId}`)
  }
}

module.exports = {Spreadsheet}
