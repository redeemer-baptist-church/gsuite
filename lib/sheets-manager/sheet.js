const ow = require('ow')

class Sheet {
  constructor(options = {}) {
    ow(options, ow.object.exactShape({
      json: ow.object,
      spreadsheet: ow.object,
    }))
    this.props = options
  }

  async getAllCells() {
    return this.spreadsheet.getAllCells(this.sheetName)
  }

  async getColumn(columnId) {
    return this.spreadsheet.getColumn({
      sheetName: this.sheetName,
      columnId,
    })
  }

  get properties() {
    return this.props.json.properties
  }

  get sheetName() {
    return this.properties.title
  }

  get sheetId() {
    return this.properties.sheetId
  }

  get frozenRowCount() {
    return this.properties.gridProperties.frozenRowCount
  }

  get spreadsheet() {
    return this.spreadsheet
  }
}

module.exports = {Sheet}
