export const START_TIME = new Date(2022, 11, 3, 10, 0, 0, 0).getTime();
export const END_TIME = new Date(2022, 11, 4, 16, 0, 0, 0).getTime();

export enum ROUTE {
  CALENDAR = '/',
  TEAMS = '/teams',
  PROJECTS = '/projects',
  YOUR_PROJECT = '/your-project',
  ADMIN = '/admin',
}

export const ABLY_CHANNEL = 'ablyMundihack';

export enum ABLY_EVENT {
  UPDATE_TEAMS = 'update-teams',
  UPDATE_ACTIONS = 'update-actions',
}

export const MAX_TEAM_SIZE = 1;

export enum ACTION {
  TEAM = 'team',
  VOTE = 'vote',
  PROJECT = 'project',
}

export const defaultActions: { [key in ACTION]: boolean } = {
  [ACTION.TEAM]: false,
  [ACTION.VOTE]: false,
  [ACTION.PROJECT]: false,
};
