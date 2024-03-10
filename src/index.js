import { OrgAnalyzer } from './orgAnalyzer.js'
import { spawn } from 'child_process'

const ghToken = process.env['GH_TOKEN']
const [ org ] = process.argv.slice(2)

function pbcopy (data) {
  const proc = spawn('pbcopy')
  proc.stdin.write(data)
  proc.stdin.end()
}

const analyzer = new OrgAnalyzer(org, ghToken)

analyzer.getMetrics().then((metrics) => {
  console.log({ metrics })
  pbcopy([
    metrics.orgName,
    metrics.topLanguage,
    metrics.followers,
    metrics.topRepoStars,
    metrics.topRepoForks,
    metrics.topRepoCloseEvents12m,
    metrics.topRepoCloseEvents3m,
    metrics.topRepoCommitEvents12m,
    metrics.topRepoCommitEvents3m,
    metrics.topRepoTotal,
  ].join('\t'))
})
