## Description

This repository contains the github workflow for the Moodle-Plugin-CI pipeline. It is used to
automate the testing and deployment of Moodle plugins hosted by the Learnweb organization.

The goal of this repository is to provide a reusable and configurable workflow for the different
plugins, allowing them to be tested and deployed with minimal configuration and without writing
the workflow file in each plugin repository. The workflow itself runs different steps like checking
the code style, running unit tests and behat test agains different php versions, databases and
Moodle versions. The release workflow deploys the plugin to the Moodle plugin directory for a new
release.

## How to use the repository

To use the repository in a plugin no installation or cloning is required.
In the plugin `.github/workflows/` directory two files are needed:

- `moodle-ci.yml`: The file that calls this repository workflow to test the plugin against different.
- `moodle-release.yml`: The file that calls the release workflow.

Optional, but maybe needed;

- `config.json`: Configuration file that defines workflow parameters. Needed if the plugin wants an own configuration or
                 has additional plugins that need to be installed during the tests.

---

### The workflow files

The `moodle-ci.yml` and `moodle-release.yml` call the workflow.

The `moodle-ci.yml` is always the same. In the `with` section you can set the following parameters
(all boolean, all set to `false` by default):
- `allow-phpcs-warning`: If set to true, the workflow will not fail if the Code checker finds warnings.
- `allow-phpcs-error`: If set to true, the workflow will not fail if the Code checker finds errors.
- `allow-phpdoc-error`: If set to true, the workflow will not fail if the PHPDoc checker finds errors.
- `allow-mustache-lint-error`: If set to true, the workflow will not fail if the Mustache linter finds errors.
- `allow-grunt-error`: If set to true, the workflow will not fail if grunt step fails.

The `moodle-ci.yml` file looks like this:
```yaml
name: Moodle Plugin CI
on: [ push, pull_request ]

jobs:
  call:
    name: ""
    uses: learnweb/moodle-workflows-learnweb/.github/workflows/moodle-ci.yml@main
    with:
      allow-mustache-lint-error: true
```

The `moodle-release.yml` needs the plugin name (e.g. `mod_moodleoverflow` or `block_townsquare`):

```yaml
name: Moodle Plugin Release

on:
  release:
    types: [ published ]

jobs:
  call-moodle-release-workflow:
    uses: learnweb/moodle-workflows-learnweb/.github/workflows/moodle-release.yml@main
    with:
      plugin-name: 'plugin_name'
    secrets: inherit

```

---

### The configuration file

The `config.json` file defines the plugins configuration for the workflow. In most cases, it's unnecessary to define as
this workflow plugin stores a basic configuration (except the `additional_plugins` attribute) adapted to the latest
moodle versions. The following attributes can be overwritten or defined:
- `moodle-plugin-ci`: The version of the official [Moodle-Plugin-CI repository](https://github.com/moodlehq/moodle-plugin-ci)
  repository to use. Look up the tags and choose the latest version.
- `main-moodle`: The main Moodle branch that the plugin is developed against. Look up the
  [Moodle branches](https://github.com/moodle/moodle/branches) and choose a stable version.
- `main-php`: The main PHP version for the plugin.
- `main-db`: The main database for the plugin. This can be `pgsql`, `mariadb` or `mysqli`.
- `moodle-testmatrix`: The Moodle test matrix. The test matrix defines different Moodle versions, php versions and databases
  that the plugin should be tested against the PHPUnit and Behat tests. If not defined, the workflow will
  only use the main-moodle, main-php and main-db properties. If the plugin wants to support multiple
  Moodle versions, the test matrix should be defined.
- `additional_plugins`: An array of additional plugins. When plugins depend on other plugins, this property can be used to
  define the additional plugins that should be installed during the tests, as otherwise the workflow
  fails. Set this if your plugin depends on other plugins that are not part of the Moodle core.

An example config file with different options for the testmatrix looks like the example under (remove the `//` comments before
using it). Check on the [Moodle Releases](https://moodledev.io/general/releases) which Moodle versions are supported and check on
[Moodle PHP versions](https://moodledev.io/general/development/policies/php) which PHP versions are supported for each Moodle version.
Then choose which tests you want to include:

```json
{
  "moodle-plugin-ci": "4.5.8",
  "main-moodle": "MOODLE_500_STABLE",
  "main-php": "8.3",
  "main-db": "pgsql",
  "moodle-testmatrix": { // Defines a matrix with all tests that will be run
    "MOODLE_401_STABLE": {  // This will test moodle 4.1 against pgsql and php 8.0 + 8.1
      "php": ["8.0", "8.1"]
    },
    "MOODLE_404_STABLE": { // This will test moodle 4.4 against php 8.3 and mariadb 
      "db": ["mariadb"]
    },
    "MOODLE_405_STABLE": { // This will test moodle 4.5 against php 8.3 and pgsql
      
    },
    "MOODLE_500_STABLE": { // This will test moodle 5.0 against php 8.2, 8.3 and 8.4, each against pgsql, mariadb and mysqli
      "php": ["8.2", "8.3", "8.4"],
      "db": ["pgsql", "mariadb", "mysqli"]
    }
  },
  "additional_plugins": [ // How to include additional plugins. The plugin is the github repository url.
    "learnweb/moodle-mod_moodleoverflow",
    "learnweb/moodle-block_townsquare",
    "moodlehq/moodle-local_codechecker"
  ]
}
```
