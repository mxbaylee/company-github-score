## :octocat: Company Github Score

Aggregates data about a github org to inform a company score.

### Installing

```
git clone git@github.com:mxbaylee/company-github-score.git
cd company-github-score
npm install
```

### Running

```
npm start -- wikimedia
```

Example output:

```json
{
  metrics: {
    orgName: 'wikimedia',
    topLanguage: 'JavaScript',
    followers: 963,
    topRepoStars: 12001,
    topRepoForks: 3443,
    topRepoCloseEvents12m: 1013,
    topRepoCloseEvents3m: 294,
    topRepoCommitEvents12m: 23640,
    topRepoCommitEvents3m: 6527,
    topRepoTotal: 10
  }
}
```

### Testing

```
npm test
```
