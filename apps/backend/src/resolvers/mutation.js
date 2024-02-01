// prettier-ignore

import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {GraphQLError} from 'graphql';

import dotenv from 'dotenv';
dotenv.config();

export default {
	newNote: async (parent, args, {models, user}) => {
		if (!user) {
			// throw new Error('You must be signed in to create a note');
			throw new GraphQLError(
				'You must be signed in to create a note',
				{
					extensions: {
						code: 'UNAUTHENTICATED',
					},
				},
			);
		}
		return await models.Note.create({
			content: args.content,
			// author: 'Terence Hamilton',
			author: new mongoose.Types.ObjectId(user.id),
		});
	},
	deleteNote: async (parent, {id}, {models, user}) => {
		// if not a user, throw an Authentication Error
		if (!user) {
			// throw new Error('You must be signed in to create a note');
			throw new GraphQLError(
				'You must be signed in to create a note',
				{
					extensions: {
						code: 'UNAUTHENTICATED',
					},
				},
			);
		}

		// find the note
		const note = await models.Note.findById(id);
		// if the note owner and current user don't match, throw a forbidden error
		// prettier-ignore
		if (note && String(note.author) !== user.id) {
			throw new GraphQLError("You don't have permissions to delete this note", {
				extensions: {
					code: "FORBIDDEN",
				},
			});
		}

		try {
			await models.Note.findOneAndDelete({_id: id});
			return true;
		} catch (err) {
			return false;
		}
	},
	updateNote: async (parent, {content, id}, {models, user}) => {
		if (!user) {
			throw new GraphQLError(
				'You must be signed in to update a note',
				{
					extensions: {
						code: 'FORBIDDEN',
					},
				},
			);
		}
		// find the note
		const note = await models.Note.findById(id);
		// if the note owner and current user don't match, throw a forbidden error
		// prettier-ignore
		if (note && String(note.author) !== user.id) {
			throw new GraphQLError("You don't have permissions to update the note", {
				extensions: {
					code: "FORBIDDEN",
				},
			});
		}
		try {
			return await models.Note.findOneAndUpdate(
				{
					_id: id,
				},
				{
					$set: {
						content,
					},
				},
				{
					new: true,
				},
			);
		} catch (err) {
			throw new Error('Error updating note');
		}
	},
	signUp: async (
		parent,
		{username, email, password, confirmed},
		{models},
	) => {
		// normalize email address
		email = email.trim().toLowerCase();
		// hash the password
		const hashed = await bcrypt.hash(password, 10); // create the gravatar url
		// const avatar = gravatar(email);
		try {
			const user = await models.User.create({
				username,
				email,
				// avatar,
				password: hashed,
			});
			// create and return the json web token
			return await jwt.sign({id: user._id}, process.env.JWT_SECRET);
		} catch (err) {
			console.log(err);
			throw new GraphQLError('Error creating account', {
				extensions: {
					code: 'FORBIDDEN',
				},
			});
		}
	},
	signIn: async (parent, {username, email, password}, {models}) => {
		if (email) {
			// normalize email address
			email = email.trim().toLowerCase();
		}
		const user = await models.User.findOne({
			$or: [{email}, {username}],
		});
		// if no user is found, throw an authentication error
		if (!user) {
			// throw new AuthenticationError('Error signing in');
			throw new GraphQLError('Error signing in', {
				extensions: {
					code: 'UNAUTHENTICATED',
				},
			});
		}
		// if the passwords don't match, throw an authentication error
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			// throw new AuthenticationError('Error signing in');
			throw new GraphQLError('Error signing in', {
				extensions: {
					code: 'UNAUTHENTICATED',
				},
			});
		}
		// create and return the json web token
		return jwt.sign({id: user._id}, process.env.JWT_SECRET);
	},
	toggleFavorite: async (parent, {id}, {models, user}) => {
		// if no user context is passed, throw auth error
		if (!user) {
			throw new GraphQLError('You must sign in to favorite a note.', {
				extensions: {
					code: 'UNAUTHENTICATED',
				},
			});
		}
		// check to see if the user has already favorited the note
		const noteCheck = await models.Note.findById(id);
		const hasUser = noteCheck.favoritedBy.indexOf(user.id);

		// if the user exists in the list
		// pull them from the list and reduce the favoriteCount by 1
		if (hasUser >= 0) {
			return await models.Note.findByIdAndUpdate(
				id,
				{
					$pull: {
						favoritedBy: new mongoose.Types.ObjectId(user.id),
					},
					$inc: {
						favoriteCount: -1,
					},
				},
				{
					// Set new to true to return the updated document
					new: true,
				},
			);
		} else {
			// if the user doesn't exist in the list
			// add them to the list and increment the favoriteCount by 1
			return await models.Note.findByIdAndUpdate(
				id,
				{
					$push: {
						favoritedBy: new mongoose.Types.ObjectId(user.id),
					},
					$inc: {
						favoriteCount: 1,
					},
				},
				{
					new: true,
				},
			);
		}
	},
};
