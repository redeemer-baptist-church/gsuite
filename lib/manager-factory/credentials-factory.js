const {SecretClient} = require('@redeemerbc/secret')

class CredentialsFactory {
  static async loadRedeemerBaptistChurchCredentials() {
    const secretClient = new SecretClient()
    return {
      client_email: await secretClient.read('GoogleApplicationCredentialsClientEmail'),
      private_key: await secretClient.read('GoogleApplicationCredentialsPrivateKey'),
      subject: await secretClient.read('GsuiteServiceAccount'),
    }
  }
}

module.exports = {CredentialsFactory}
