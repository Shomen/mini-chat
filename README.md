# Mini Chat

A simple shared chat app built with React, TypeScript, and STOMP over WebSocket. It uses a small Node.js server with stomp-broker-js to pass messages between connected users.

I built this project to practise real-time messaging and React connection setup and cleanup.

## Features

- Join with a name or as a guest
- Send and receive messages in a shared room
- Connection status
- Automatically reconnect when the server becomes available

Messages are kept only in browser memory and disappear on refresh.

## Run locally

Install dependencies:

npm install

Start the backend:

npm run server

In another terminal, start the frontend:

npm run dev

Open the Vite URL in two browser tabs, join with different names, and start chatting.

## Checks

npm run build
npm run lint