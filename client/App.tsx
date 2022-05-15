import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

import useTheme from './hooks/useTheme';
import useToggle from './hooks/useToggle';
import { apiService } from './utils/apiUtils';
import { getSocket } from './utils/socketUtils';
import { listMutator } from './utils/listUtils';
import { getErrorMessage } from '../shared/utils/errorUtils';
import { Project, User } from './types/baseTypes';

import Page from './components/Page/Page';
import PageHeader from './components/PageHeader/PageHeader';
import PageContent from './components/PageContent/PageContent';
import PageFooter from './components/PageFooter/PageFooter';

import Alert from './components/Alert/Alert';
import Button from './components/Button/Button';
import Cards from './components/Cards/Cards';
import Card from './components/Card/Card';
import Input from './components/Input/Input';
import Loader from './components/Loader/Loader';

import './styles/global.scss';

const api = apiService();

const HeaderTitle = () => {
  const flexStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  return (
    <div style={flexStyles}>
      <i className="material-icons">api</i>
      <h1 style={{ margin: '0 0 0 10px', fontSize: '1.4em' }}>semiterrestrial</h1>
    </div>
  );
};

type AuthenticatorProps = {
  onSetUser: (u: undefined | User) => void;
};

const Authenticator = ({ onSetUser }: AuthenticatorProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState('one@foo.com');
  const [password, setPassword] = useState('foo');
  const [user, setUser] = useState<undefined | User>(undefined);
  const [error, setError] = useState<string>();

  const getSelf = async () => {
    if (!user) {
      try {
        const newUser = await api.get<User>('self');
        if (newUser) {
          setUser(newUser);
          onSetUser(newUser);
        }
      } catch (e) {
        // do nothing
      }
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      if (!email || !password) throw new Error('Email and password are required!');
      const newUser = await api.post<User>('login', { email, password });
      if (newUser) {
        setUser(newUser);
        onSetUser(newUser);
      } else {
        throw new Error('Could not log in');
      }
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const logout = async () => {
    try {
      await api.post('logout', { email });
      setUser(undefined);
      onSetUser(undefined);
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  useEffect(() => {
    getSelf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Card><Loader /></Card>;

  return (
    <Card>
      {!user ? (
        <>
          <h2>Login</h2>
          <Input label="Email" value={email} onChange={setEmail} />
          <Input label="Password" value={password} onChange={setPassword} />
          <Button variant="primary" onClick={login} style={{ width: '100%' }}>
            Login
          </Button>
        </>

      ) : (
        <Button variant="secondary" onClick={logout} style={{ width: '100%' }}>
          Logout
        </Button>
      )}
      {error && (
        <Alert variant="error" dismissable>
          {error}
        </Alert>
      )}
    </Card>
  );
};

type ProjectListProps = {
  projects: undefined | Project[],
};

const ProjectList = ({ projects }: ProjectListProps) => {
  const [editing, toggleEditing] = useToggle(false);
  const [error, setError] = useState<string>();

  const createProject = async () => {
    try {
      const name = 'Some Test';
      const status = 'PENDING';
      await api.post('projects', { name, status });
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const updateProject = async (project: Project) => {
    try {
      await api.put(`projects/${project.projectId}`, project);
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await api.del(`projects/${projectId}`);
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const hasProjects = Boolean(projects && projects.length);

  const smStyles = {
    fontSize: '0.8rem',
    padding: '0.5rem',
    margin: 0,
    lineHeight: '1',
  };

  const lgStyles = {
    fontSize: '1rem',
    lineHeight: '1.5rem',
    padding: '0.5rem',
    margin: '0 0 1.5rem',
    border: '2px solid transparent',
  };

  return (
    <Card>
      <h2>
        Projects{' '}
        {hasProjects && <Button onClick={toggleEditing} icon="edit" /> }
      </h2>
      {error && (
        <Alert variant="error" dismissable>
          {error}
        </Alert>
      )}
      {projects && projects.map(({ projectId, name, status }) => (
        <div key={projectId}>
          {editing ? (
            <>
              <Input
                label={projectId}
                value={name}
                onChange={(newName: string) => {
                  const newProject: Project = {
                    projectId,
                    status,
                    name: newName,
                  };
                  updateProject(newProject);
                }}
              />
              <Button onClick={() => deleteProject(projectId)} icon="delete" />
            </>
          ) : (
            <div>
              <p style={smStyles}>{projectId}</p>
              <p style={lgStyles}>{name}</p>
            </div>
          )}
        </div>
      ))}
      <Button onClick={createProject} icon="add" />
    </Card>
  );
};

function attachEventHandlersProjects(
  socket: Socket,
  projects: Project[],
  setProjects: (p: Project[]) => void,
) {
  const projectsMutator = listMutator<Project>('projectId');

  socket.on('event-project-create', ({ data }: { data: Project }) => {
    const newProjects = projectsMutator.add(data, projects);
    setProjects(newProjects);
  });

  socket.on('event-project-update', ({ data }: { data: Project }) => {
    const newProjects = projectsMutator.update(data, projects);
    setProjects(newProjects);
  });

  socket.on('event-project-delete', ({ data: { id } }: { data: { id: string } }) => {
    const newProjects = projectsMutator.remove(id, projects);
    setProjects(newProjects);
  });
}

const App = () => {
  const [theme, toggleTheme] = useTheme();
  const [socket, setSocket] = useState<Socket>();
  const [user, setUser] = useState<User>();
  const [projects, setProjects] = useState<Project[]>();

  const themeColor = theme === 'light' ? 'rgb(9, 113, 241)' : '#ff9800';
  const themeIcon = theme === 'light' ? 'dark_mode' : 'light_mode';

  useEffect(() => {
    if (user && !socket) {
      const postLogin = async () => {
        const newSocket = getSocket(user);
        setSocket(newSocket);

        const newProjects: Project[] = await api.get('projects');
        setProjects(newProjects);

        attachEventHandlersProjects(newSocket, newProjects, setProjects);
      };

      postLogin();
    }
  }, [user, socket]);

  console.log({ user, projects });

  return (
    <Page fullWidth>
      <PageHeader>
        <HeaderTitle />
        <Button
          icon={themeIcon}
          style={{ color: themeColor, marginLeft: 'auto', paddingRight: 0 }}
          onClick={toggleTheme}
        />
      </PageHeader>
      <PageContent>
        <Cards numCards={2}>
          <Authenticator onSetUser={setUser} />
          <ProjectList projects={projects} />
        </Cards>
      </PageContent>
      <PageFooter>
        <p>Copyright © 2021 Semiterrestrial</p>
      </PageFooter>
    </Page>
  );
};

export default App;



