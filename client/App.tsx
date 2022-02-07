import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useTheme } from './hooks/useTheme';
import { Team, User, Event, EventGetTeams, EventGetUsers } from '../shared/types/eventTypes';

import Page from './components/Page/Page';
import PageHeader from './components/PageHeader/PageHeader';
import PageContent from './components/PageContent/PageContent';
import PageFooter from './components/PageFooter/PageFooter';

import Alert from './components/Alert/Alert';
import Button from './components/Button/Button';
import Cards from './components/Cards/Cards';
import Card from './components/Card/Card';
import Hero from './components/Hero/Hero';
import Input from './components/Input/Input';
// import Loader from './components/Loader/Loader';

import './styles/global.scss';

const baseUrl = 'http://localhost';
const apiPort = 3000;
const socketPort = 8080;

const apiBaseUrl = `${baseUrl}:${apiPort}`;
const socketBaseUrl = `${baseUrl}:${socketPort}`;

function createTeam(name: string) {
  fetch(`${apiBaseUrl}/api/v1/teams`, {
    method: 'POST',
    body: JSON.stringify({ name }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function createUser(name: string, teamId: string) {
  fetch(`${apiBaseUrl}/api/v1/users`, {
    method: 'POST',
    body: JSON.stringify({ name, teamId }),
  });
}


const App = () => {
  const socket = io(socketBaseUrl, { withCredentials: true });
  const [socketId, setSocketId] = useState<null | string>(socket.id);
  const { theme, toggleTheme } = useTheme();

  const [teamName, setTeamName] = useState('');
  const onSaveTeam = () => {
    createTeam(teamName);
    setTeamName('');
  };

  const [userName, setUserName] = useState('');
  const [teamId, setTeamId] = useState('');
  const onSaveUser = () => {
    createUser(userName, teamId);
    setUserName('');
    setTeamId('');
  };

  const [teams, setTeams] = useState<Record<string, Team>>({});
  const [users, setUsers] = useState<Record<string, User>>({});

  useEffect(() => {
    socket.on('connect', () => {
      if (!socketId) setSocketId(socket.id);
    });
  }, [socket, socketId]);

  socket.on('GET_TEAMS', (event: EventGetTeams) => setTeams(event.data.teams));
  socket.on('GET_USERS', (event: EventGetUsers) => setUsers(event.data.users));


  return (
    <Page fullWidth>
      <PageHeader>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <i className="material-icons" style={{ marginRight: 10 }}>
            api
          </i>
          <h1 style={{ margin: 0, fontSize: '1.4em' }}>semiterrestrial</h1>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Button
            style={{
              color: theme === 'light' ? '#ff9800' : 'rgb(9, 113, 241)',
            }}
            icon={theme === 'light' ? 'light_mode' : 'dark_mode'}
            onClick={toggleTheme}
          />
        </div>
      </PageHeader>
      <PageContent>
        <Alert variant="error" dismissable>
          Something went wrong when trying to save. Please try again.
        </Alert>
        <Hero
          background="linear-gradient(315deg, #9921e8 0%, #5f72be 74%)"
          color="white"
          text="Configure once. Deploy anywhere."
        />
        <Cards numCards={2}>
          <Card>
            <h2>Team Form</h2>
            <Input label="Team name" value={teamName} onChange={setTeamName} />
            <Button variant="primary" onClick={onSaveTeam}>
              Create team
            </Button>
          </Card>
          <Card>
            <h2>User Form</h2>
            <Input label="User name" value={userName} onChange={setUserName} />
            <Input label="Team ID" value={teamId} onChange={setTeamId} />
            <Button variant="primary" onClick={onSaveUser}>
              Create user
            </Button>
          </Card>
        </Cards>

        <Cards numCards={2}>
          <Card>
            <h2>Teams</h2>
            {Object.values(teams).map((t) => (
              <pre key={t.id} style={{ background: '#454545', color: '#ccc', padding: '1rem', borderRadius: '0.4rem' }}>
                - {t.id} | {t.name}
              </pre>
            ))}
          </Card>
          <Card>
            <h2>Users</h2>
            {Object.values(users).map((u) => (
              <pre key={u.id} style={{ background: '#454545', color: '#ccc', padding: '1rem', borderRadius: '0.4rem' }}>
                - {u.id} | {u.name} | {u.teamId}
              </pre>
            ))}
          </Card>
        </Cards>

        <Cards numCards={1}>
          <Card>
            <h2>So Metric</h2>
            <p>
              Maecenas posuere nisi a augue accumsan, sit amet dapibus quam posuere sit amet dap
              posuere.
            </p>
            <Button variant="primary">Find out more</Button>
          </Card>
        </Cards>
        <Cards numCards={2}>
          <Card>
            <h2>Main Metric</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at lacus tortor.
              Suspendisse id dignissim tortor.
            </p>
            <Button variant="primary">Primary</Button>
          </Card>
          <Card>
            <h2>Another Metric</h2>
            <p>
              Donec dignissim odio in feugiat accumsan, sem erat elementum tortor, vitae dignissim
              magna arcu id urna.
            </p>
            <Button variant="secondary">Secondary</Button>
          </Card>
        </Cards>
        <Cards numCards={2}>
          <Card>
            <h2>Main Metric</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at lacus tortor.
              Suspendisse id dignissim tortor.
            </p>
            <Button outlined variant="primary">
              Primary
            </Button>
          </Card>
          <Card>
            <h2>Another Metric</h2>
            <p>
              Donec dignissim odio in feugiat accumsan, sem erat elementum tortor, vitae dignissim
              magna arcu id urna.
            </p>
            <Button outlined variant="secondary">
              Secondary
            </Button>
          </Card>
        </Cards>
        <Cards numCards={3}>
          <Card>
            <h2>Main Metric</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at lacus tortor.
              Suspendisse id dignissim tortor.
            </p>
            <Button variant="primary">Find out more</Button>
          </Card>
          <Card>
            <h2>Another Metric</h2>
            <p>
              Donec dignissim odio in feugiat accumsan, sem erat elementum tortor, vitae dignissim
              magna arcu id urna.
            </p>
            <Button variant="primary">Find out more</Button>
          </Card>
          <Card>
            <h2>So Metric</h2>
            <p>
              Maecenas posuere nisi a augue accumsan, sit amet dapibus quam posuere sit amet dap
              posuere.
            </p>
            <Button variant="primary">Find out more</Button>
          </Card>
        </Cards>
        <Cards numCards={4}>
          <Card>
            <h2>Main Metric</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at lacus tortor.
              Suspendisse id dignissim tortor.
            </p>
            <Button variant="error">Find out error</Button>
          </Card>
          <Card>
            <h2>Another Metric</h2>
            <p>
              Donec dignissim odio in feugiat accumsan, sem erat elementum tortor, vitae dignissim
              magna arcu id urna.
            </p>
            <Button variant="warning">Find out warning</Button>
          </Card>
          <Card>
            <h2>So Metric</h2>
            <p>
              Maecenas posuere nisi a augue accumsan, sit amet dapibus quam posuere sit amet dap
              posuere sit amet.
            </p>
            <Button variant="info">Find out info</Button>
          </Card>
          <Card>
            <h2>Main Metric</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at lacus tortor.
              Suspendisse id dignissim tortor.
            </p>
            <Button variant="success">Find out success</Button>
          </Card>
        </Cards>
        <Cards numCards={4}>
          <Card>
            <h2>Main Metric</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at lacus tortor.
              Suspendisse id dignissim tortor.
            </p>
            <Button outlined variant="error">
              Find out error
            </Button>
          </Card>
          <Card>
            <h2>Another Metric</h2>
            <p>
              Donec dignissim odio in feugiat accumsan, sem erat elementum tortor, vitae dignissim
              magna arcu id urna.
            </p>
            <Button outlined variant="warning">
              Find out warning
            </Button>
          </Card>
          <Card>
            <h2>So Metric</h2>
            <p>
              Maecenas posuere nisi a augue accumsan, sit amet dapibus quam posuere sit amet dap
              posuere sit amet.
            </p>
            <Button outlined variant="info">
              Find out info
            </Button>
          </Card>
          <Card>
            <h2>Main Metric</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at lacus tortor.
              Suspendisse id dignissim tortor.
            </p>
            <Button outlined variant="success">
              Find out success
            </Button>
          </Card>
        </Cards>
        <Cards numCards={4}>
          <Card>
            <h2>Main Metric</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at lacus tortor.
              Suspendisse id dignissim tortor.
            </p>
            <Button variant="error" icon="error">
              Error
            </Button>
          </Card>
          <Card>
            <h2>Another Metric</h2>
            <p>
              Donec dignissim odio in feugiat accumsan, sem erat elementum tortor, vitae dignissim
              magna arcu id urna.
            </p>
            <Button variant="warning" icon="warning">
              Warning
            </Button>
          </Card>
          <Card>
            <h2>So Metric</h2>
            <p>
              Maecenas posuere nisi a augue accumsan, sit amet dapibus quam posuere sit amet dap
              posuere sit amet.
            </p>
            <Button variant="info" icon="info">
              Info
            </Button>
          </Card>
          <Card>
            <h2>Main Metric</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at lacus tortor.
              Suspendisse id dignissim tortor.
            </p>
            <Button variant="success" icon="check_circle">
              Success
            </Button>
          </Card>
        </Cards>
        <Cards numCards={4}>
          <Card>
            <h2>Main Metric</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at lacus tortor.
              Suspendisse id dignissim tortor.
            </p>
            <Button outlined variant="error" icon="error">
              Error
            </Button>
          </Card>
          <Card>
            <h2>Another Metric</h2>
            <p>
              Donec dignissim odio in feugiat accumsan, sem erat elementum tortor, vitae dignissim
              magna arcu id urna.
            </p>
            <Button outlined variant="warning" icon="warning">
              Warning
            </Button>
          </Card>
          <Card>
            <h2>So Metric</h2>
            <p>
              Maecenas posuere nisi a augue accumsan, sit amet dapibus quam posuere sit amet dap
              posuere sit amet.
            </p>
            <Button outlined variant="info" icon="info">
              Info
            </Button>
          </Card>
          <Card>
            <h2>Main Metric</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at lacus tortor.
              Suspendisse id dignissim tortor.
            </p>
            <Button outlined variant="success" icon="check_circle">
              Success
            </Button>
          </Card>
        </Cards>
        <Cards numCards={1}>
          <Card>
            <h2>Form</h2>
            <Input label="One" value="Value one" onChange={() => undefined} />
            <Input label="Two" value="Value two" onChange={() => undefined} />
            <Button variant="primary">Submit</Button>
          </Card>
        </Cards>
      </PageContent>
      <PageFooter>
        <p>Copyright © 2021 Base Layout UI</p>
      </PageFooter>
    </Page>
  );
};

export default App;



