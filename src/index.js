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
  pbcopy(`${metrics.orgName}\t${metrics.topLanguage}\t${metrics.followers}\t${metrics.topRepoStars}\t${metrics.topRepoForks}\t${metrics.topRepoCloseEvents12m}\t${metrics.topRepoCloseEvents3m}\t${metrics.topRepoCommitEvents12m}\t${metrics.topRepoCommitEvents3m}\t${metrics.topRepoTotal}\t${stdevTemp}\t${highTemp}\t${lowTemp}\t${overcastScore}\t${sunshineScore}`);
})
