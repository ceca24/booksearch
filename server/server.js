const express = require("express");
const path = require("path");
const db = require("./config/connection");

// importing apollo server
const { ApolloServer } = require("apollo-server-express");

// importing authMiddleware
const { authMiddleware } = require("./utils/auth");

// requiring typedefs
const { typeDefs, resolvers } = require("./schema");

const app = express();
const PORT = process.env.PORT || 3001;
// importing the servers middle ware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});


db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});