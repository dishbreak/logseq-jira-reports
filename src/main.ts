import '@logseq/libs';
import { settings } from './settings';
import { IBatchBlock } from '@logseq/libs/dist/LSPlugin.user';
import { Jira, IssueMap } from './jira';

async function main() {
  logseq.useSettingsSchema(settings)
  logseq.onSettingsChanged((a, b) => {
    logseq.UI.showMsg("Please reload the plugin for changes to take effect", "warning")
  })

  if (!logseq.settings?.jiraUrl || !logseq.settings?.jiraUsername || !logseq.settings?.jiraToken || !logseq.settings?.boardID) {
    logseq.UI.showMsg("Please configure all JIRA settings in the plugin settings page.", "warning")
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

  logseq.Editor.registerSlashCommand("Get Current Jira Board", async () => {
    const currentBlock = await logseq.Editor.getCurrentBlock()
    if (!currentBlock) {
      throw new Error("failed to get current block")
    }

    const previousContents = currentBlock.content
    await logseq.Editor.updateBlock(currentBlock.uuid, `Fetching results from JIRA...`)

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

logseq.ready(main).catch(console.error);
