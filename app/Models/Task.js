'use strict'

const Model = use('Model')

class Task extends Model {
  static boot () {
    super.boot()

    // this.addHook('beforeSave', 'TaskHook.sendNewTaskMail')
    this.addHook('afterCreate', 'TaskHook.sendNewTaskMail')
    this.addHook('beforeUpdate', 'TaskHook.sendNewTaskMail')
  }

  project () {
    return this.belongsTo('App/Models/Project')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  file () {
    return this.belongsTo('App/Models/File') // if N-N belongsToMany
  }
}

module.exports = Task
