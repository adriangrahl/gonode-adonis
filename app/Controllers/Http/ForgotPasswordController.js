'use strict'

const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')
const moment = require('moment')
class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()
      user.save()

      await Mail.send(
        ['emails.forgot_password'] /* resources/views */,
        {
          email,
          username: user.username,
          token: user.token,
          link: `${request.input('redirect_url')}?token=${
            user.token
          }` /* instead of the web frontend */
        },
        message => {
          message.to(user.email)
          message.from('adrian@dev.com.br', 'Adrian | Full Stack Dev')
          message.subject('Change password')
        }
      )

      return user
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Something went wrong' } })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()

      const user = await User.findByOrFail('token', token)

      const expired = moment()
        .subtract(2, 'days')
        .isAfter(user.token_created_at)

      if (expired) {
        return response
          .status(401)
          .send({ error: { message: 'This token has expired' } })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()
    } catch (err) {
      console.log({ err })
      return response
        .status(err.status)
        .send({ error: { message: 'Something went worng' } })
    }
  }
}

module.exports = ForgotPasswordController
