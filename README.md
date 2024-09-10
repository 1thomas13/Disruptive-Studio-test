
# Disruptive-Studio-Challenge 🥇
Application for managing multimedia content

## [View Demo](https://disruptive-studio-test.vercel.app/)
![image](https://github.com/user-attachments/assets/983cd2b8-7f42-40e8-9e08-d4b462b59e45)

## For the demo you have 3 test users with their respective roles:
- admin@example.com 1234
- user@example.com 1234
- creator@example.com 1234

## Installation 🗒️

```bash
  git clone https://github.com/1thomas13/Disruptive-Studio-test.git 
  cd /Disruptive-Studio-test
```
    
```bash
  pnpm run install:all
```

Add env variables in server and client you have a .env.example for reference

```bash
  pnpm run dev
```
By default you will have the client at http://localhost:5173/ and the server at http://localhost:3000

If you want to add an admin user you should create a user and change the role with the database directly. We don't have seeders 🙇‍♂️

## Added Features ☑️

- **Admin Capabilities**:
  - An admin can create topics and content types.
  - Content types can be any file format (e.g., CSV, PDF, TXT).
  - Content can also be restricted to come from specific URLs (e.g., YouTube, Wikipedia).

- **Content Creation**:
  - Both admins and creators can create content related to a topic.
  
- **User Access**:
  - All registered users can access the content.
  - Unregistered users or users without proper permissions can only view titles.

- **Search Engine & Real-Time Updates**:
  - Includes a search engine.
  - Real-time updates of the amount of content per topic using WebSockets.
  - Note: WebSockets in the demo don't work because Vercel deployment doesn't support it. [Learn more](https://vercel.com/guides/do-vercel-serverless-functions-support-websocket-connections).

## Missing Features 😧

- **Unit Tests**:
  - Basic unit tests are missing. These should include at least the basics to ensure the application renders correctly and covers basic use cases.

- **API Documentation**:
  - API documentation is not included.

- **Content Deletion & Update**:
  - Deleting and updating content is incomplete.
  - This was deprioritized because authentication and user permissions were already in place, and these features were considered simpler.

---

That's all. Any suggestions are welcome. 😉

## Tech Stack 🔧

React, Zustand, TailwindCSS, Socket.io, Node, Express, MongoDB, Mongoose y TypeScript

## Authors 📝

- [@Thomas Barreto](https://www.github.com/1thomas123)

