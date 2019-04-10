'use strict'

const TaskHook = (exports = module.exports = {})
const Kue = use('Kue')
const Job = use('App/Jobs/NewTaskMail')

TaskHook.sendNewTaskMail = async taskInstance => {
  if (!taskInstance.user_id && !taskInstance.dirty.user_id) return

  const { title } = taskInstance
  const { username, email } = await taskInstance.user().fetch()
  const file = await taskInstance.file().fetch()

  // await Mail.send(
  //   ['emails.new_task'],
  //   {
  //     username,
  //     title,
  //     hasAttachment: !!file
  //   },
  //   message => {
  //     message
  //       .to(email)
  //       .from('adrian.grahl@gmail.com', 'Adrian | Dev Full Stack')
  //       .subject('You have a new task')

  //     if (file) {
  //       message.attach(
  //         Helpers.tmpPath(`uploads/${file.file}`, {
  //           filename: file.name
  //         })
  //       )
  //     }
  //   }
  // ) created job to handle async redis+kue

  Kue.dispatch(Job.key, { email, username, file, title }, { attempts: 3 })
}
