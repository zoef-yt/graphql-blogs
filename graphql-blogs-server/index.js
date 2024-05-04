import { ApolloServer, gql } from 'apollo-server';
import { MongoClient } from 'mongodb'
const MONGO_URI = "mongodb://127.0.0.1:27017/blogs";

let dbInstance = null;
async function connectToCluster() {
  if (dbInstance) {
    return dbInstance;
  }
  const client = new MongoClient(MONGO_URI);
  try {
    console.log("Connecting to the server...");
    await client.connect();
    console.log("Connected successfully to server");
    dbInstance = client.db("blogs");
    return dbInstance;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
connectToCluster(MONGO_URI);

const typeDefs = gql`
	type Article {
		_id: String!
		title: String
		content: String
		createdAt: String
	}
	type Comment {
		id: Int!
		article: Article
		text: String
		createdAt: String
	}
	type Query {
		article(id: Int!): Article
		articles: [Article]
		comments(articleId: Int!): [Comment]
	}
	type Mutation {
		article(title: String!, content: String!): Article
		comment(articleId: Int!, text: String!): Comment
	}
`;

const resolvers = {
  Query: {
    articles: async () => {
      const db = await connectToCluster();
      const articles = await db?.collection("blogs")?.find().toArray();
      return articles;
    }
  },
  Mutation: {
    article: async (_, { title, content }) => {
      const db = await connectToCluster();
      const article = await db?.collection("blogs")?.insertOne({ title, content, createdAt: new Date() })
      console.log(article)
      return article;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`this port ${url}`);
});
