'use strict'

const Project = use('App/Models/Project')

class ProjectController {
  async index ({ request }) {
    // const projects = await Project.all()

    const { page } = request.get()

    const projects = await Project.query()
      .with('user')
      // .fetch()
      .paginate(page)

    return projects
  }

  async store ({ request, auth }) {
    const data = request.only(['title', 'description'])

    return Project.create({ ...data, user_id: auth.user.id })
  }

  async show ({ params }) {
    const project = await Project.findOrFail(params.id)

    await project.load('user')
    await project.load('tasks')

    return project
  }

  async update ({ params, request }) {
    const project = await Project.findOrFail(params.id)

    const data = request.only(['title', 'description'])

    project.merge(data)
    await project.save()
    return project
  }

  async destroy ({ params }) {
    const project = await Project.findOrFail(params.id)

    await project.delete()
  }
}

module.exports = ProjectController
