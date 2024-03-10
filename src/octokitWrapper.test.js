import { describe, expect, it, vi } from 'vitest'
import { OctokitWrapper } from './octokitWrapper.js'

describe('OctokitWrapper', () => {
  describe('org', () => {
    it('calls request when cache is empty', async () => {
      const wrapper = new OctokitWrapper({ auth: 'princess' })
      wrapper.octokit.request = vi.fn().mockReturnValue(Promise.resolve({
        data: {
          name: 'princess.wiggles',
          followers: 'lots',
        },
      }))
      const result = await wrapper.org('wiggles')
      expect(result.name).toEqual('princess.wiggles')
      expect(wrapper.octokit.request).toHaveBeenCalled()
    })

    it('uses cache when possible', async () => {
      const wrapper = new OctokitWrapper({ auth: 'princess' })
      wrapper.cache['org/wiggles'] = {
        name: 'wiggles.princess',
        followers: 'tons',
      }
      wrapper.octokit.request = vi.fn().mockReturnValue(Promise.resolve({
        data: {
          name: 'princess.wiggles',
          followers: 'lots',
        },
      }))
      const result = await wrapper.org('wiggles')
      expect(result.name).toEqual('wiggles.princess')
      expect(wrapper.octokit.request).not.toHaveBeenCalled()
    })
  })
})
