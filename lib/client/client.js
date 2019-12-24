const {google} = require('googleapis')
const ow = require('ow')

class Client {
  constructor(scopes = [], credentials) {
    ow(scopes, ow.array) // TODO: validate that scopes are actually gsuite-style scopes
    ow(credentials, ow.object.exactShape({
      subject: ow.string,
      client_email: ow.string,
      private_key: ow.string,
    }))

    this.props = {
      scopes,
      credentials,
    }
  }

  // api might be admin, people, etc
  async buildConnection(api, version) {
    return this.buildAuth().then(auth => google[api]({version, auth}))
  }

  /* Auth is done via Application Default Credentials:
   *  https://github.com/googleapis/google-auth-library-nodejs#application-default-credentials .
   *
   * NOTE: Actually, we are forcing JWT, because that's the only way to get
   * domain-wide delegated access via this.props.subject
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
    this._auth = this._auth || await new google.auth.JWT({
      email: this.props.credentials.client_email,
      key: this.props.credentials.private_key,
      scopes: this.props.scopes,
      subject: this.props.credentials.subject,
    })

    return this._auth
  }
}

module.exports = {Client}
