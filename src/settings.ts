import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

export const settings: SettingSchemaDesc[] = [
  {
    key: "jiraReportSettings",
    title: "JIRA Account Configurations",
    description: "Use this configuration to set up JIRA Account credentials",
    type: "heading",
    default: null,
  },
  {
    key: "jiraUrl",
    title: "JIRA URL",
    description: "The base URL of your JIRA instance",
    type: "string",
    default: "",
  },
  {
    key: "jiraUsername",
    title: "JIRA Username",
    description: "Your JIRA account username",
    type: "string",
    default: "",
  },
  {
    key: "jiraToken",
    title: "JIRA Token",
    description: "Your JIRA API token",
    type: "string",
    default: "",
  },
  {
    key: "boardID",
    title: "Board ID",
    description: "The ID for the Jira Board to query for",
    type: "number",
    default: 0,
  },
]
