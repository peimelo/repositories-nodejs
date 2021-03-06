const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('frontend/build'));

const repositories = [];

app.get('/', (req, res) => {
  const help = `
  <pre>
    Welcome to Repositories!

    GET /repositories
      USAGE:
        Get all repositories.

    POST /repositories
      USAGE:
        Add a new repository.
      BODY:
        title - String
        url - String
        techs - String[]

    PUT /repositories/:id
      USAGE:
        Edit the details of an existing repository.
      BODY:
        title - String
        url - String
        techs - String[]

    DELETE /repositories/:id
      USAGE:
        Delete an existing repository.

    POST /repositories/:id/like
      USAGE:
        Increment repository like.
  </pre>
  `;

  res.send(help);
});

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const id = uuid();

  const repository = { id, title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const repository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(repositoryIndex, 1);

  response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const likesIncremented = repositories[repositoryIndex].likes + 1;

  const repository = {
    ...repositories[repositoryIndex],
    likes: likesIncremented,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;
