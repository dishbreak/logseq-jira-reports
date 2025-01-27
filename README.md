# Logseq Jira Report Plugin

Logseq Plugin that outputs blocks based on Jira contents. Based on vipzhicheng-starter/logseq-plugin-starter.

This plugin is useful for generating point-in-time blocks based on the Jira API. Users may find this plugin useful in the context of journals. Issues get created as pages i.e. `[[ KEY-123 ]]`. This allows the user to collect private notes on a Jira Issue and track progress across multiple journal entries.

## Configuration

The plugin needs to be configured before its first use. Note that slash commands won't appear unless the plugin is configured.

The following configuration parameters are required:

| Item | Description |
| - | - |
| `jiraUrl` | The base URL of your JIRA instance (e.g. https://contoso.atlassian.net/) | 
| `jiraUsername` | The username for your JIRA instance (e.g. jappleseed@contoso.com) |
| `jiraToken` | The JIRA API token. You can create this by visiting [your Atlassian account page](https://id.atlassian.com/manage-profile/profile-and-visibility) |


## Slash Commands

### Get Current Jira Board

Outputs tickets assigned to you on the configured board, broken out by columns as defined by the board. Note that `boardId` must be set to a non-zero value for this slash command to appear. The board ID is the last item in a URL to a sprint board e.g. https://contos.atlassian.net/jira/software/c/projects/software/boards/543 corresponds to board ID 543. 

### Get Jira Issues Assigned to Me

Outputs tickets assigned to the current user. The JQL for this view is configured via the `assignedToMeQuery` setting.

### Get Jira Issues Viewed Today

Shows all Jira Issues viewed today by the current user, ideal for use in journals. The JQL for this view is configured via the `seenTodayQuery` setting.

## Development

### Setup

This project relies on [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm). To set up the project, run the following commands:

```shell
# activate desired node version
nvm use

# setup yarn via corepack
corepack enable

# install dependencies
yarn install
```

### Building the Plugin

Yarn handles invoking Webpack. To build the plugin, run:

```shell
yarn run build
```

A `dist/` directory will appear in the root of your repository.

### Loading Plugin in Logseq

1. In the Logseq desktop app, under the _Advanced_ tab in Settings, enable _Developer Mode_. 
2. Select the three dots in the upper right hand corner and select _Plugins_. You should now see an option called _Load Unpacked Plugin_. Click it.
3. Browse to the **dist/** directory created when you ran the build command.

Note that when you make changes to the plugin, you'll need to rerun `yarn run build` and click _Reload_ on the _logseq-jira-reports_ card on the _Plugins_ screen in order to see your changes take effect.

## License
MIT
