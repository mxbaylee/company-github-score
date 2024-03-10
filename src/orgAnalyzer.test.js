import { describe, expect, it, vi, beforeAll } from 'vitest'
import { OrgAnalyzer } from './orgAnalyzer.js'

const TIME = {
  now: '2024-03-21T09:12:41Z',
  twoYearsAgo: '2022-03-21T09:12:41Z',
}

describe('OrgAnalyzer', () => {
  beforeAll(async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(TIME.now))
  })

  describe('getRepoIssueCloseEvents', () => {
    it('returns only closed events in 12 months', async () => {
      const org = new OrgAnalyzer('princess', 'wiggles')
      org.octokit.issueEvents = vi.fn().mockReturnValue(Promise.resolve([
        { event: 'eat', created_at: TIME.now },
        { event: 'that', created_at: TIME.now },
        { event: 'venison', created_at: TIME.now },
        { event: 'closed', created_at: TIME.now },
        { event: 'closed', created_at: TIME.twoYearsAgo },
      ]))
      const events = await org.getRepoIssueCloseEvents('venison', 12)
      expect(events.length).toEqual(1)
    })
  })

  describe('getRepoCommitEvents', () => {
    it('returns events within the given months', async () => {
      const org = new OrgAnalyzer('princess', 'wiggles')
      org.octokit.commitEvents = vi.fn().mockReturnValue(Promise.resolve([
        { timestamp: TIME.now },
        { timestamp: TIME.twoYearsAgo },
      ]))
      const events = await org.getRepoCommitEvents('venison', 12)
      expect(events.length).toEqual(1)
    })
  })

  describe('getTopRepos', () => {
    it('sorts and filters top repos', async () => {
      // Setup
      const org = new OrgAnalyzer('princess', 'wiggles')
      org.octokit.repos = vi.fn().mockReturnValue(Promise.resolve([
        { name: 'venison', stargazers_count: 2 },
        { name: 'princess', stargazers_count: 10 },
        { name: 'wiggles', stargazers_count: 8 },
      ]))
      // Action
      const repos = await org.getTopRepos(2)
      // Asert
      expect(repos.length).toEqual(2)
      const topRepos = ['princess', 'wiggles']
      expect(topRepos.includes(repos[0].name)).toEqual(true)
      expect(topRepos.includes(repos[1].name)).toEqual(true)
    })
  })

  describe('getTopLanguage', () => {
    it('finds the top language', async () => {
      const org = new OrgAnalyzer('princess', 'wiggles')
      org.octokit.repos = vi.fn().mockReturnValue(Promise.resolve([
        { name: 'venison', language: 'dogfood' },
        { name: 'bullystick', language: 'dogfood' },
        { name: 'princess', language: 'puppy' },
      ]))

      expect(await org.getTopLanguage()).toEqual('dogfood')
    })

    it('ignores null values', async () => {
      const org = new OrgAnalyzer('princess', 'wiggles')
      org.octokit.repos = vi.fn().mockReturnValue(Promise.resolve([
        { name: 'venison', language: 'dogfood' },
        { name: 'bullystick', language: 'dogfood' },
        { name: 'princess', language: 'puppy' },
        { name: 'bambi', language: null },
        { name: 'rudolph', language: null },
        { name: 'donner', language: null },
      ]))

      expect(await org.getTopLanguage()).toEqual('dogfood')
    })
  })
})
