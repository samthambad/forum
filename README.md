# Deployable Discussion Forum

## Use Cases

- Organisations which can make use of an internal forum based platform.
- In classes to facilitate discussion without privacy & security issues.

## Architecture

React(Next.js) Frontend + Go Backend with Gin + PGSQL DB. All of this is to be done in a docker container such that users can easily deploy their application with minimal configuration or user intervention.

## UI/UX

UI will be following Material UI.

## Accounts & Profile

Users will be able to create accounts with their email ID. Users will have access to all their activity such as posts and comments.

## Threads

The main way of communication will be through the use of user-created threads. Other users can comment on these threads.

## Search and Tagging

Threads must be tagged and are searchable for ease of access and clarity in discussion.

## Restriction One to Many Communication

I believe this is the best way for knowledge sharing.
