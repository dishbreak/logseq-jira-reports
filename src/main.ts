import '@logseq/libs';
import { settings } from './settings';
import { IBatchBlock } from '@logseq/libs/dist/LSPlugin.user';
import { Jira } from './jira';

async function main() {
  logseq.useSettingsSchema(settings)

  const jira = new Jira(
    logseq.settings?.jiraUrl as string,
    logseq.settings?.jiraUsername as string,
    logseq.settings?.jiraToken as string,
    logseq.settings?.boardID as number,
  )
  logseq.Editor.registerSlashCommand("Get Current Jira Board", async () => {
    const currentBlock = await logseq.Editor.getCurrentBlock()
    if (!currentBlock) {
      throw new Error("failed to get current block")
    }

    await logseq.Editor.updateBlock(currentBlock.uuid, `Fetching results from JIRA...`)

    const contents = await jira.getBoard()
    let blocks: Array<IBatchBlock> = Object.entries(contents).map(([col, issues]) => {
      let b: IBatchBlock = { content: `🟦 ${col} (${issues.length} ${issues.length === 1 ? "issue" : "issues"})` }
      b.children = issues.map((issue) => {
        return { content: `🎫 [[${issue.key}]] - [${issue.fields.summary}](${jira.absolutePath("/browse/" + issue.key)})` }
      })
      return b
    })

    await logseq.Editor.updateBlock(currentBlock.uuid, `**Jira Tickets as of ${new Date().toLocaleString()}**`)
    await logseq.Editor.insertBatchBlock(currentBlock.uuid, blocks, { sibling: false })
  })

}

logseq.ready(main).catch(console.error);
