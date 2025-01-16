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

Shows all Jira Issues viewed today by the current useful, ideal for use in journals. The JQL for this view is configured via the `seenTodayQuery` setting.

## License
MIT
