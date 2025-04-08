import { UserRole as PrismaUserRole, TemplateType } from "@prisma/client";
import { ReactNode } from "react";
import { ClientData as PrismaClientData } from "@prisma/client";

// Define TemplateType enum locally since it's not exported from Prisma client

// types.ts
export type User = {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: PrismaUserRole;
};

export interface Stage {
  id: string;
  name: string;
  report?: string;
  docType: string;
  docUrl?: string;
  clientDataId: number;
  status?: string;
  active?: boolean;
  project: ClientData;
  stageUsers: StageUsers[];
  createdAt: Date;
}

export interface TimeBilled {
  id: string;
  timeInHours: number;
  timestampLogged: Date;
  assignedDate: Date;
  logMethod: string;
  projectId: string;
  authorId: string;
}

export interface Invoice {
  id: string;
  amount: number;
  issueDate: Date;
  dueDate: Date;
  projectId: string;
  status: string;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  hubspotLink: string;
  trelloBoardLink: string;
  status: string;
  billingType: string;
  upworkProfile: string;
  startDate: Date;
  createdAt: Date;
  archived: boolean;
  stages: Stage[];
  timeBilled: TimeBilled[];
  invoices: Invoice[];
}

export interface IProjectWithStages extends Project {
  stages: Stage[];
}

// TimeLog model
export type TimeLog = {
  assignedDate: Date;
  createdAt: Date;
  current: Date | null;
  description: string;
  id: string;
  logMethod: string;
  projectId: string;
  stageId: string;
  timeInHours: number;
  trelloTaskLink: string;
  userId: string;
};

// StageUsers model
export type StageUsers = {
  stageId: string;
  userId: string;
};

export enum UserRole {
  Superadmin = "Superadmin",
  Developer = "Developer",
  Designer = "Designer",
  PM = "PM",
  BDM = "BDM",
}

export type Room = {
  TTR: number;
  fullRoomObject: any;
  hubspotDealId: string | null;
  recentTimestamp: bigint;
  roomCreated: Date;
  roomId: string;
  roomName: string;
  roomType: number;
  stage: StagesSet;
  topic: string;
};

export interface IUpworkResponseSuccess {
  cursor: string;
  rooms: Array<{
    roomId: string;
    roomName: string;
    roomType: number;
    topic: string;
    recentTimestamp: bigint;
    TTR: number;
  }>;
  total: number;
}

export type IUpworkResponse = IUpworkResponseSuccess | "error";

export interface IFetchResultRooms extends MessageEvent {
  data: {
    type: string;
    response: IUpworkResponse;
  };
}

export type Story = {
  created: bigint;
  fullStoryObject: any;
  markedAsAbusive: number;
  message?: string;
  header?: string;
  messageId: string;
  modified: number;
  roomId: string;
  storyId: string;
  updated: bigint;
  userId: string;
  userModifiedTimestamp: bigint;
  direction?: "OUTGOING" | "INCOMING" | "UNKNOWN";
  author?: string | null;
  orgId?: string;
};

export interface IUpworkStoriesSuccess {
  cursor: string;
  stories: Array<{
    created: bigint;
    orgId: string;
    markedAsAbusive: number;
    message: string;
    messageId: string;
    modified: number;
    roomId: string;
    storyId: string;
    updated: bigint;
    userId: string;
    userModifiedTimestamp: bigint;
    direction: "OUTGOING" | "INCOMING" | "UNKNOWN" | null;
    author: string | null;
  }>;
  total: number;
}

export type IUpworkStories = IUpworkStoriesSuccess | "error";

export type UpworkStatPeriod = "day" | "week" | "month" | "year" | "all";

export interface IRoomWithCount extends Room {
  stories: Story[];
  _count: {
    stories: number;
  };
}

export type DayOfWeek = string;

export interface IUpworkRoomItem {
  TTR: number;
  agent: string;
  authors: string[];
  client: string;
  clientMessages: number;
  lastMessageAuthor: string;
  lastStoryDate: Date;
  recentTimestamp: bigint;
  roomCreated: string;
  roomId: string;
  roomName: string;
  stage: StagesSet;
  totalMessages: number;
}

export interface ITooltipProps {
  bg?: "dark" | "light" | null;
  children: ReactNode;
  className?: string;
  content?: string;
  position?: "top" | "bottom" | "left" | "right";
  size?: "sm" | "md" | "lg" | "none";
}

export interface StageWithProject extends Stage {
  project: ClientData;
}

export interface TimeLogWithProjectAndStages extends TimeLog {
  stage: StageWithProject;
}

export type UnknownClients = {
  [storyId: string]: { userId: string; clientName: string; agents: string[] };
};

export type StagesSet =
  | "Request"
  | "Active chat"
  | "Call accepted"
  | "Requirements gathered"
  | "Proposal sent"
  | "Waiting for response"
  | "Closed won"
  | "Closed lost"
  | "-";

export type ILogWithUserProjectStage = TimeLog & {
  user: User;
  stage: StageWithProject;
};

export interface ILogsStatData {
  weekLogs: {
    assignedDate: string;
    timeInHours: number;
  }[];
  monthLogs: number | null;
  uniqueUsers: {
    userId: string;
    userName: string | null;
  }[];
  uniqueStages: {
    stageId: string;
    stageName: string;
    projectId: string;
  }[];
  uniqueProjects: {
    projectId: string;
    projectName: string;
  }[];
  filteredUsers: {
    userId: string;
    userName: string | null;
  }[];
  filteredStages: {}[];
  filteredProjects: {}[];
}

export interface IBillingStat {
  weekLogs: { [date: string]: { tracked: number; billed: number } };
  totalWeek: number;
  uniqueClients: string[];
}

export type IProjectTimeLogResult = TimeLog & {
  user: User;
  stage: StageWithProject;
};

export interface ProjectWithLogsAndBilling extends Project {
  timeLogs: (TimeLog & { user: User })[];
  timeBilled: TimeBilled[];
}

export interface ProjectWithGroupedLogsAndBilling extends Project {
  timeLogs: Record<string, (TimeLog & { user: User })[]>;
  timeBilled: TimeBilled[];
}

export type GroupedResult = Record<
  string,
  Record<string, IProjectTimeLogResult[]>
>;

export type ClientData = PrismaClientData;

export interface WebsiteData {
  id: number;
  clientId: number;

  projectName: string;

  domain: string;
  siteName: string;
  description: string;
  githubRepositoryUrl: string;

  pages: string[];
  template: TemplateType;

  googleAnalyticsId?: string;
  searchConsoleId?: string;

  homePageContent: {
    title: string;
    heroBlock?: {
      title: string;
      subtitle: string;
    };
    mainBlock: {
      title: string;
      text: string;
    };
    statBlock?: {
      title: string;
      items: string[];
    };
    whyChooseBlock?: {
      title: string;
      subtitle: string;
      items: string[];
    };
    keysBlock: {
      title: string;
      items: string[];
      footer: string;
    };
    footer: string;
  };

  aboutPageContent: {
    title: string;
    mainBlock: {
      title: string;
      text: string;
    };
    keysBlock: {
      title: string;
      items: {
        name: string;
        description: string;
      }[];
      footer: string;
    };
    footer: string;
  };

  blogPageContent?: string;
  newsPageContent?: string;
  contactPageContent?: string;

  vercelProjectId: string;
  vercelDeploymentId: string;

  socialLinks: {
    x: string;
    facebook: string;
    linkedin: string;
  };

  assets: any;

  isPublished: boolean;
  lastBuildAt: Date;

  createdAt: Date;
  updatedAt: Date;
}
