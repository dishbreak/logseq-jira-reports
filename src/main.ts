import '@logseq/libs';
import { settings } from './settings';
import { IBatchBlock } from '@logseq/libs/dist/LSPlugin.user';
import { Jira, IssueMap, IssueSearchResults } from './jira';

const fetchingResults = "⏱️ Fetching results from Jira..."

async function main() {
  logseq.useSettingsSchema(settings)
  logseq.onSettingsChanged((a, b) => {
    logseq.UI.showMsg("Please reload the plugin for changes to take effect", "warning")
  })

  if (!logseq.settings?.jiraUrl || !logseq.settings?.jiraUsername || !logseq.settings?.jiraToken) {
    logseq.UI.showMsg("Please configure JIRA settings in the plugin settings page.", "warning")
    return
  }

  var jira: Jira
  try {
    jira = new Jira(
      logseq.settings?.jiraUrl as string,
      logseq.settings?.jiraUsername as string,
      logseq.settings?.jiraToken as string,
      logseq.settings?.boardID as number,
    )
  } catch (err) {
    console.log(err)
    logseq.UI.showMsg(`failed to create jira client: ${err}`, "error")
    return
  }


  try {
    const myself = await jira.myself()
    logseq.UI.showMsg(`Connected to Jira as ${myself.displayName} <${myself.emailAddress}>`)
  } catch (err) {
    console.log(err)
    logseq.UI.showMsg(`failed to communicate with JIRA api: ${err}`, "warning")
  }

  if (logseq.settings?.boardId !== 0) {
    logseq.Editor.registerSlashCommand("Get Current Jira Board", async () => {
      const currentBlock = await logseq.Editor.getCurrentBlock()
      if (!currentBlock) {
        throw new Error("failed to get current block")
      }

      const previousContents = currentBlock.content
      await logseq.Editor.updateBlock(currentBlock.uuid, fetchingResults)

      var contents: IssueMap
      try {
        contents = await jira.getBoardContents()
      } catch (err) {
        console.log(err)
        logseq.UI.showMsg(`failed to fetch jira board: ${err}`)
        await logseq.Editor.updateBlock(currentBlock.uuid, previousContents)
        return
      }

      var boardUrl: URL
      try {
        boardUrl = await jira.getBoardUrl()
      } catch (err) {
        console.log(err)
        logseq.UI.showMsg(`failed to fetch jira board: ${err}`)
        await logseq.Editor.updateBlock(currentBlock.uuid, previousContents)
        return
      }

      let blocks: Array<IBatchBlock> = Object.entries(contents).map(([col, issues]) => {
        let b: IBatchBlock = { content: `🟦 ${col} (${issues.length} ${issues.length === 1 ? "issue" : "issues"})` }
        b.children = issues.map((issue) => {
          return { content: `🎫 [[${issue.key}]] - [${issue.fields.summary}](${jira.absolutePath("/browse/" + issue.key)})` }
        })
        return b
      })


      await logseq.Editor.updateBlock(currentBlock.uuid, `**[Jira Board](${boardUrl.toString()}) as of ${new Date().toLocaleString()}**`)
      await logseq.Editor.insertBatchBlock(currentBlock.uuid, blocks, { sibling: false })
    })
  }

  let searchSlashCommand = (title: string, query: string): () => Promise<void> => {

    return async () => {
      const currentBlock = await logseq.Editor.getCurrentBlock()
      if (!currentBlock) {
        throw new Error("failed to get current block")
      }

      const previousContents = currentBlock.content
      await logseq.Editor.updateBlock(currentBlock.uuid, fetchingResults)

      var results: IssueSearchResults
      try {
        results = await jira.searchJql(query, { fields: ["summary", "key"] })
      } catch (err) {
        console.log(err)
        logseq.UI.showMsg(`failed to display results: ${err}`, "error")
        await logseq.Editor.updateBlock(currentBlock.uuid, previousContents)
        return
      }

      var blocks: Array<IBatchBlock>
      blocks = results.issues.map((issue): IBatchBlock => {
        return { content: `🎫 [[${issue.key}]] - [${issue.fields.summary}](${jira.absolutePath("/browse/" + issue.key)})` }
      })

      await logseq.Editor.updateBlock(currentBlock.uuid, `🔍 **${title} as of ${new Date().toLocaleString()}**`)
      await logseq.Editor.insertBatchBlock(currentBlock.uuid, blocks, { sibling: false })
    }
  }

  if (logseq.settings?.assignedToMeQuery) {
    logseq.Editor.registerSlashCommand(
      "Get Jira Issues Assigned to Me", searchSlashCommand(
        "Jira issues assigned to me", logseq.settings?.assignedToMeQuery as string
      )
    )
  }

  if (logseq.settings?.seenTodayQuery) {
    logseq.Editor.registerSlashCommand(
      "Get Jira Issues Viewed Today", searchSlashCommand(
        "Jira issues viewed today", logseq.settings?.seenTodayQuery as string
      )
    )
  }
}




logseq.ready(main).catch(console.error);
