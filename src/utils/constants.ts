export const START_TIME = new Date(2022, 11, 3, 10, 0, 0, 0).getTime();
export const END_TIME = new Date(2022, 11, 4, 16, 0, 0, 0).getTime();

export enum ROUTE {
  CALENDAR = '/',
  TEAMS = '/teams',
  PROJECTS = '/projects',
  YOUR_PROJECT = '/your-project',
}

export const ABLY_CHANNEL = 'ablyMundihack';

export enum ABLY_EVENT {
  UPDATE_TEAMS = 'update-teams',
}

export const MAX_TEAM_SIZE = 3;
