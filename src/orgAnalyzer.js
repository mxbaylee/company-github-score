import { OctokitWrapper } from './octokitWrapper.js'
import { isWithinLastXMonths } from './helpers.js'

export class OrgAnalyzer {
  constructor (orgName, ghToken) {
    this.orgName = orgName
    this.octokit = new OctokitWrapper({ auth: ghToken })
  }

  getFollowers () {
    return this.octokit.org(this.orgName).then((org) => {
      return org.followers
    })
  }

  getMetrics () {
    return Promise.all([
      this.getTopLanguage(),
      this.getFollowers(),
      this.getTopRepoMetrics(),
    ]).then(([topLanguage, followers, topRepoMetrics]) => {
      return {
        orgName: this.orgName,
        topLanguage,
        followers,
        ...topRepoMetrics,
      }
    })
  }

  getDecoratedTopRepos () {
    return this.getTopRepos().then((topRepos) => {
      return Promise.all(topRepos.map((topRepo) => {
        return Promise.all([
          this.getRepoIssueCloseEvents(topRepo.name, 12),
          this.getRepoIssueCloseEvents(topRepo.name, 3),
          this.getRepoCommitEvents(topRepo.name, 12),
          this.getRepoCommitEvents(topRepo.name, 3),
        ]).then(([ closeEvents12m, closeEvents3m, commitEvents12m, commitEvents3m ]) => {
          return {
            name: topRepo.name,
            stars: topRepo.stargazers_count,
            forks: topRepo.forks_count,
            closeEvents12m,
            closeEvents3m,
            commitEvents12m,
            commitEvents3m,
          }
        })
      }))
    })
  }

  getTopRepoMetrics () {
    return this.getDecoratedTopRepos().then((decoratedTopRepos) => {
      return decoratedTopRepos.reduce((metricMap, repo) => {
        metricMap.topRepoStars += repo.stars
        metricMap.topRepoForks += repo.forks
        metricMap.topRepoCloseEvents12m += repo.closeEvents12m.length
        metricMap.topRepoCloseEvents3m += repo.closeEvents3m.length
        metricMap.topRepoCommitEvents12m += repo.commitEvents12m.length
        metricMap.topRepoCommitEvents3m += repo.commitEvents3m.length
        return metricMap
      }, {
        topRepoStars: 0,
        topRepoForks: 0,
        topRepoCloseEvents12m: 0,
        topRepoCloseEvents3m: 0,
        topRepoCommitEvents12m: 0,
        topRepoCommitEvents3m: 0,
        topRepoTotal: decoratedTopRepos.length,
      })
    })
  }

  getRepoIssueCloseEvents (repoName, withinMonths = 12) {
    return this.octokit.issueEvents(this.orgName, repoName).then((events) => {
      return events.filter((event) => {
        const isClosed = event.event === 'closed'
        const isRecent = isWithinLastXMonths(event.created_at, withinMonths)
        return isClosed && isRecent
      })
    })
  }

  getRepoCommitEvents (repoName, withinMonths = 12) {
    return this.octokit.commitEvents(this.orgName, repoName).then((events) => {
      return events.filter((event) => {
        return isWithinLastXMonths(event.timestamp, withinMonths)
      })
    })
  }

  getTopRepos (limit = 10) {
    return this.octokit.repos(this.orgName).then((repos) => {
      return repos.sort((a, b) => {
        return b.stargazers_count - a.stargazers_count
      }).slice(0, limit)
    })
  }

  getTopLanguage () {
    return this.getTopRepos().then((topRepos) => {
      let maxCount = 0
      let languageMap = {}
      return topRepos.reduce((topLanguage, { language: currentLanguage }) => {
        if (!currentLanguage) return topLanguage
        // Increment count
        const languageCount = (languageMap[currentLanguage] || 0) + 1
        // Set new count
        languageMap[currentLanguage] = languageCount
        // set new max
        maxCount = Math.max(maxCount, languageCount)
        // set top language
        return languageCount === maxCount ? (
          currentLanguage
        ) : (
          topLanguage
        )
      }, null)
    })
  }
}
