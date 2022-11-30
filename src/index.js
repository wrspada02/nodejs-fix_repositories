const { request } = require("express");
const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkIfRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).send();
  }

  request.index = repositoryIndex;

  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repositories);
});

app.put("/repositories/:id", checkIfRepositoryExists, (request, response) => {
  const { index } = request;
  const { title, url, techs } = request.body;

  const newRepository = {
    title,
    url,
    techs
  };

  const repository = { ...repositories[index], ...newRepository };

  repositories[index] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", checkIfRepositoryExists, (request, response) => {
  const { index } = request;

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkIfRepositoryExists, (request, response) => {
  const { index } = request;

  ++repositories[index].likes;

  return response.json(repositories);
});

module.exports = app;
