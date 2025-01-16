# Logseq Jira Report Plugin

Logseq Plugin that outputs blocks based on Jira. Based on vipzhicheng-starter/logseq-plugin-starter.

## Configuration

The plugin needs to be configured before its first use. Note that slash commands won't appear unless the plugin is configured.

| Item | Description |
| - | - |
| jiraUrl | The base URL of your JIRA instance (e.g. https://contoso.atlassian.net/) | 
| jiraUsername | The username for your JIRA instance (e.g. jappleseed@contoso.com) |
| jiraToken | The JIRA API token. You can create this by visiting [your Atlassian account page](https://id.atlassian.com/manage-profile/profile-and-visibility) |
| boardId | The id of the board to pull reports from. This is typically the last part of the URL i.e. https://contoso.atlassian.net/jira/software/c/projects/software/boards/543 corresponds to board ID 543. |

## Slash Commands

### Get Current Jira Board

Outputs tickets assigned to you on the configured board, broken out by columns as defined by the board.

## License
MIT
