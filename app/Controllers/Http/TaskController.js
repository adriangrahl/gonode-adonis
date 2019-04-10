'use strict'

const Task = use('App/Models/Task')

class TaskController {
  async index ({ params }) {
    const tasks = await Task.query()
      .where('project_id', params.projects_id)
      .with('user')
      .with('project')
      .fetch()

    return tasks
  }

  async store ({ request, params }) {
    const data = request.only([
      'title',
      'description',
      'due_date',
      'user_id',
      'file_id'
    ])

    const task = Task.create({
      ...data,
      project_id: params.projects_id
    })

    return task
  }

  async show ({ params }) {
    const task = await Task.findOrFail(params.id)

    await task.load('user')
    await task.load('project')

    return task
  }

  async update ({ params, request }) {
    const task = await Task.findOrFail(params.id)

    const data = request.only([
      'title',
      'description',
      'due_date',
      'user_id',
      'file_id'
    ])

    task.merge(data)
    await task.save()
    return task
  }

  async destroy ({ params }) {
    const task = await Task.findOrFail(params.id)
    await task.delete()
  }
}

module.exports = TaskController
