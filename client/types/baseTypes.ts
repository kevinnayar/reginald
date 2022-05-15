export type WithKidsProps = { children: any };

export type Variant =
  | 'error'
  | 'warning'
  | 'info'
  | 'success'
  | 'primary'
  | 'secondary';

export type User = {
  email: string;
  name: string;
  userId: string;
  teamId: string;
};

export type Project = {
  name: string;
  projectId: string;
  status: string;
};
