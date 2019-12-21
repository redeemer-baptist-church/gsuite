const {google} = require('googleapis')
const ow = require('ow')

class Client {
  constructor(scopes = [], subject = undefined) {
    ow(scopes, ow.array) // TODO: validate that scopes are actually gsuite-style scopes
    ow(subject, ow.any(ow.undefined, ow.string))
    this.props = {}
    this.props.scopes = scopes
    this.props.subject = subject
  }

  // api might be admin, people, etc
  async buildConnection(api, version) {
    return this.buildAuth().then(auth => google[api]({version, auth}))
  }

  /* Auth is done via Application Default Credentials:
   *  https://github.com/googleapis/google-auth-library-nodejs#application-default-credentials .
   *
   * GCloud credentials are provided for a specific GCloud project.
   * The ID of that project is authorized to execute certain scopes at:
   *  https://admin.google.com/redeemerbc.com/pagelet/ManageOauthClients .
   *
   * See https://support.google.com/a/answer/162106?hl=en for more detail on GSuite OAuth
   * Also: https://developers.google.com/identity/protocols/OAuth2ServiceAccount#delegatingauthority .
   *
   * The current list of scopes required by Redeemer Baptist Church is:
   * TODO: audit these, especially the admin.directory.resource.calendar,
   * and the readonly vs readwrite variants of the same permission
   * https://www.googleapis.com/auth/admin.directory.group,https://www.googleapis.com/auth/admin.directory.resource.calendar,https://www.googleapis.com/auth/admin.directory.user.readonly,https://www.googleapis.com/auth/contacts,https://www.googleapis.com/auth/contacts.readonly,https://www.googleapis.com/auth/calendar,https://www.googleapis.com/auth/calendar.readonly,https://www.googleapis.com/auth/spreadsheets.readonly
   */
  async buildAuth() {
    this._auth = this._auth || await google.auth.getClient({
      scopes: this.props.scopes,
      clientOptions: {
        subject: this.props.subject,
      },
    })
    return this._auth
  }
}

module.exports = {Client}
