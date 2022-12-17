export const START_TIME = new Date(2023, 0, 26, 10, 0, 0, 0).getTime();
export const END_TIME = new Date(2023, 0, 27, 16, 0, 0, 0).getTime();

export enum ROUTE {
  CALENDAR = '/',
  TEAMS = '/teams',
  PROJECTS = '/projects',
  YOUR_PROJECT = '/your-project',
  ADMIN = '/admin',
  AUTH_ERROR = '/auth-error',
}

export const ABLY_CHANNEL = 'ablyMundihack';

export enum ABLY_EVENT {
  UPDATE_TEAMS = 'update-teams',
  UPDATE_ACTIONS = 'update-actions',
  UPDATE_TEAM_PROJECT = 'update-team-project',
}

export const MIN_TEAM_SIZE = 2;
export const MAX_TEAM_SIZE = 3;

export const CHARACTER_WIDTH = 10.56;

export enum ACTION {
  TEAM = 'team',
  PROJECT = 'project',
}

export const defaultActions: { [key in ACTION]: boolean } = {
  [ACTION.TEAM]: false,
  [ACTION.PROJECT]: false,
};

export enum AUTH_STATUS {
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  LOADING = 'loading',
}

export const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
