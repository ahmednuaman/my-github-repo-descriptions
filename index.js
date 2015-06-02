var argv = require('yargs').argv,
    Github = require('github'),
    github = new Github({
      version: '3.0.0',
      protocol: 'https'
    }),
    page = 1,
    Spinner = require('its-thinking'),
    spinner = new Spinner(),
    token = argv._[1],
    username = argv._[0] || 'ahmednuaman',
    repos;

function fetchRepos (page) {
  github.authenticate({
    type: 'oauth',
    token: token
  });
  github.repos.getFromUser({
    user: username,
    per_page: 100,
    page: page,
    sort: 'pushed',
  }, function (err, res) {
    if (!err) {
      handleRepos(res);
    }
  });
}

function handleRepos (res) {
  repos = repos || [];

  if (res.length) {
    repos = repos.concat(res);
    fetchRepos(++page);
  } else {
    findDescriptions();
  }
}

function findDescriptions () {
  repos.forEach(function (repo) {
    console.log(repo.name + ': ' + repo.description);
  });

  spinner.stop();
  spinner.reset();
}

spinner.set(8);
spinner.start('Loading Github data ');
fetchRepos(page);
