import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
	type Article {
		id: Int!
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

const resolvers = {};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
	console.log(`this port ${url}`);
});
