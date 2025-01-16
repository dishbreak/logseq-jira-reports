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

  async getBoardContents(): Promise<IssueMap> {
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

  async searchJql(query: string, options?: Partial<SearchOptions>): Promise<IssueSearchResults> {
    const req = new URL("/rest/api/3/search/jql", this.url)
    req.searchParams.set("jql", query)
    if (options?.fields) {
      req.searchParams.set("fields", options.fields.join(","))
    }
    if (options?.maxResults) {
      req.searchParams.set("maxResults", options.maxResults.toString())
    }

    return this.get<IssueSearchResults>(req)
  }

  async getBoardUrl(): Promise<URL> {
    const boardInfo = await this.get<Board>(`/rest/agile/1.0/board/${this.boardID}`)
    return new URL(`/jira/software/c/projects/${boardInfo.location.projectTypeKey}/boards/${this.boardID}`, this.url)
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

export type IssueSearchResults = { issues: Issue[] }

export type SearchOptions = {
  maxResults: number,
  fields: Array<string>
}

export type IssueMap = { [key: string]: Issue[] }

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

type Board = {
  id: number,
  location: {
    displayName: string,
    name: string,
    projectId: number,
    projectKey: string,
    projectName: string,
    projectTypeKey: string,
    userAccountId: string,
    userId: number,
  },
  name: string,
  self: string,
  type: string,
}
