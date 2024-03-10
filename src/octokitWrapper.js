import { Octokit } from 'octokit'

export class OctokitWrapper {
  constructor ({ auth }) {
    this.octokit = new Octokit({ auth })
    this.cache = {}
  }

  org (orgName) {
    const cacheKey = `org/${orgName}`
    if (!this.cache[cacheKey]) {
      this.cache[cacheKey] = (
        this.octokit.request(`GET /orgs/${orgName}`).then(({ data }) => {
          return data
        })
      )
    }
    return this.cache[cacheKey]
  }

  repos (orgName) {
    const cacheKey = `repos/${orgName}`
    if (!this.cache[cacheKey]) {
      this.cache[cacheKey] = (
        this.octokit.paginate(`GET /orgs/${orgName}/repos`, { per_page: 100 })
      )
    }
    return this.cache[cacheKey]
  }

  commitEvents (orgName, repoName) {
    const cacheKey = `commitEvents/${orgName}/${repoName}`
    if (!this.cache[cacheKey]) {
      this.cache[cacheKey] = (
        this.octokit.paginate(`GET /repos/${orgName}/${repoName}/activity`, {
          per_page: 100,
          time_period: 'year',
          activity_type: ['push', 'force_push'],
        })
      )
    }
    return this.cache[cacheKey]
  }

  issueEvents (orgName, repoName) {
    const cacheKey = `issueEvents/${orgName}/${repoName}`
    if (!this.cache[cacheKey]) {
      this.cache[cacheKey] = (
        this.octokit.paginate(`GET /repos/${orgName}/${repoName}/issues/events`, {
          per_page: 100,
        })
      )
    }
    return this.cache[cacheKey]
  }
}

