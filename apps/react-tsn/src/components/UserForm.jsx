import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

import Button from './Button';

const Wrapper = styled.div`
	border: 1px solid #fca311;
	max-width: 500px;
	padding: 1em;
	margin: 0 auto;
	margin-top: 10%;
`;

const Form = styled.form`
	label,
	input {
		display: block;
		line-height: 2em;
	}
	input {
		width: 100%;
		margin-bottom: 1em;
	}
`;

const UserForm = (props) => {
  // set the default state of the form
  const [values, setValues] = useState();
  // update the state when a user types in the form
  const onChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Wrapper>
      {/* Display the appropriate form header */}
      {props.formType === 'signup' && <h2>Sign Up</h2>}
      {props.formType === 'signIn' && <h2>Sign In</h2>}
      {props.formType === 'reset' && <h2>Reset Password</h2>}
      {/* perform the mutation when a user submits the form */}
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          props.action({
            variables: {
              ...values,
            },
          });
        }}
      >
        {props.formType === 'signup' && (
          <>
            <label htmlFor="username">Username:</label>
            <input
              required
              type="text"
              id="username"
              name="username"
              placeholder="username"
              onChange={onChange}
            />
            <label htmlFor="email">Email:</label>
            <input
              required
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              onChange={onChange}
            />
            <label htmlFor="password">Password:</label>
            <input
              required
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              onChange={onChange}
            />
            <Button type="submit">Submit</Button>
          </>
        )}
        {props.formType === 'signIn' && (
          <>
            <label htmlFor="email">Email:</label>
            <input
              required
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              onChange={onChange}
            />
            <label htmlFor="password">Password:</label>
            <input
              required
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              onChange={onChange}
            />
            <Button type="submit">Submit</Button>
          </>
        )}
        {props.formType === 'reset' && (
          <>
            <label htmlFor="username">Username:</label>
            <input
              required
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              onChange={onChange}
            />
            <label htmlFor="email">Email:</label>
            <input
              required
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              onChange={onChange}
            />
            <Button type="submit">Reset Password</Button>
          </>
        )}
      </Form>
      {props.formType !== 'reset' && (
        <Link to={'/reset'}>
          <p>
            <Button>Reset Password</Button>
          </p>
        </Link>
      )}
    </Wrapper>
  );
};
export default UserForm;
