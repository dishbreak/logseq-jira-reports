import { error } from "console";

export class Jira {
  url: URL;
  username: string;
  token: string;
  boardID: number;

  constructor(url: string, username: string, token: string, boardID: number) {
    try {
      this.url = new URL(url);
    } catch {
      throw new Error("failed to initialize: invalid Jira URL")
    }
    this.username = username;
    this.token = token;
    this.boardID = boardID;
  }

  async get<T>(path: string | URL): Promise<T> {
    if (typeof path === "string") {
      path = new URL(path, this.url)
    }
    const response = await fetch(path, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(this.username + ":" + this.token)}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from Jira: ${response.statusText}`);
    }

    return response.json();
  }

  async getIssuesForBoard(boardID: number): Promise<IssueSearchResults> {
    const req = new URL(`/rest/agile/1.0/board/${boardID}/issue`, this.url)
    req.searchParams.set("jql", "assignee = currentUser() AND sprint in openSprints()")
    req.searchParams.set("fields", ["summary", "status", "description"].join(","))

    return this.get<IssueSearchResults>(req)
  }

  async getBoard(): Promise<IssueMap> {
    const boardConfig = await this.get<BoardConfig>(`/rest/agile/1.0/board/${this.boardID}/configuration`)
    let result: IssueMap = {}
    let columnForStatus: { [key: string]: string } = {}
    boardConfig.columnConfig.columns.forEach((col) => {
      result[col.name] = [] as Issue[];
      col.statuses.forEach((status) => {
        columnForStatus[status.id] = col.name
      })
    })

    const matchingIssues = await this.getIssuesForBoard(this.boardID)
    matchingIssues.issues.forEach((issue) => {
      result[columnForStatus[issue.fields.status.id]].push(issue)
    })

    return result
  }

  absolutePath(path: string): string {
    return new URL(path, this.url).toString()
  }

  async myself(): Promise<Myself> {
    return this.get<Myself>(`/rest/api/3/myself`)
  }
}

type Myself = {
  displayName: string
  emailAddress: string
}

type IssueSearchResults = { issues: Issue[] }

type IssueMap = { [key: string]: Issue[] }

type Issue = {
  key: string,
  fields: {
    summary: string,
    status: {
      name: string,
      id: string,
    }
    description: string,
  }
  url: string,
}

type ColumnConfig = {
  name: string,
  statuses: {
    id: string,
    self: string,
  }[]
}

type BoardConfig = {
  self: string,
  filter: {
    id: string,
    self: string,
  },
  columnConfig: {
    columns: ColumnConfig[]
  },
}
