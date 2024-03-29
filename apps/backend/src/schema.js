import gql from 'graphql-tag';

const typeDefs = gql`
	#graphql
	scalar DateTime

	type Note {
		id: ID!
		content: String!
		author: User!
		createdAt: DateTime!
		updatedAt: DateTime!
		favoriteCount: Int!
		favoritedBy: [User!]
	}

	type NoteFeed {
		notes: [Note]!
		cursor: String!
		hasNextPage: Boolean!
	}

	type User {
		id: ID!
		username: String!
		email: String
		avatar: String
		notes: [Note!]!
		favorites: [Note!]
	}

	type Query {
		hello: String
		notes: [Note!]!
		note(id: ID): Note!
		user(username: String!): User
		users: [User!]!
		me: User!
		noteFeed(cursor: String): NoteFeed
	}

	type Mutation {
		newNote(content: String!): Note
		updateNote(id: ID!, content: String!): Note!
		deleteNote(id: ID!): Boolean!
		signUp(
			username: String!
			email: String!
			password: String!
			verified: Boolean
		): String!
		signIn(
			username: String
			email: String
			password: String!
		): String!
		toggleFavorite(id: ID!): Note!
		resetPassword(username: String!, email: String!): String!
		updatePassword(id: ID!, password: String!): String!
	}
`;

export {typeDefs as default};
