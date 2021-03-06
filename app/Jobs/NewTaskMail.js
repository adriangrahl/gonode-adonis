'use strict'

const Mail = use('Mail')
const Helpers = use('Helpers')

class NewTaskMail {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'NewTaskMail-job'
  }

  // data
  async handle ({ email, username, title, file }) {
    console.log(`Job ${NewTaskMail.key}`)
    await Mail.send(
      ['emails.new_task'],
      {
        username,
        title,
        hasAttachment: !!file
      },
      message => {
        message
          .to(email)
          .from('adrian.grahl@gmail.com', 'Adrian | Dev Full Stack')
          .subject('You have a new task')

        if (file) {
          message.attach(
            Helpers.tmpPath(`uploads/${file.file}`, {
              filename: file.name
            })
          )
        }
      }
    )
  }
}

module.exports = NewTaskMail
