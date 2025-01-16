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
  {
    key: "assignedToMeQuery",
    title: "JQL Query: Issues Assigned to Me",
    description: "Query used to display issues assigned to user",
    type: "string",
    default: "assignee = currentUser() AND status NOT IN (Done, Closed, Archived)",
  },
  {
    key: "seenTodayQuery",
    title: "JQL Query: Issues Seen Today",
    description: "Query used to display issues the user viewed today",
    type: "string",
    default: "lastViewed >= startOfDay() order by lastViewed",
  },
]
