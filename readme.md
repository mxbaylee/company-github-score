## :octocat: Company Github Score

Aggregates data about a github org to inform a company score.

### 🌻 Installing

```
git clone git@github.com:mxbaylee/company-github-score.git
cd company-github-score
npm install
```

### 🔏 Authenticating

This repo uses a Github personal access token.

* [Create an Token](https://github.com/settings/tokens)
* Add the token to your environment file

```
export GH_TOKEN="princess.wiggles"
```

### 🥞 Running

```
npm start -- wikimedia
```

Example output:

```js
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

### 🍡 Testing

```
npm test
```

## 🎯 Score

This formula creates a "Github Engagement Score" to help rank companies during your job search.
It prioritizes companies with a higher level of Github activity relative to their employee
count. This means companies attracting more contributions (stars, forks, code commits) per
employee will score higher.

### 🧪 Variables

* `F` followers: number of org level followers
* `T` topRepoTotal: number of repositories considered
* `S` topRepoStars: sum of stars across "top repositories"
* `Fk` topRepoForks: sum of forks across "top repositories"
* `Ce` topRepoCloseEvents12m: sum of closed issues/pull requests across "top repositories"
* `Co` topRepoCommitEvents12m: sum of commit events across "top repositories"
* `E` EmployeeCount: number of employees (🚧 not provided)
* `GES` Github Engagement Score

### 📐 Formula

```
GES = (F + (S + Fk + Ce + Co) / T) / E
```
