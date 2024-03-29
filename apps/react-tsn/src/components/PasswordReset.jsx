import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {ApolloError, useMutation} from '@apollo/client';
import {UPDATE_PASSWORD} from '../gql/mutation';
import axios from 'axios';
import Button from './Button';
import styled from 'styled-components';

const Wrapper = styled.div`
	border: 1px solid #fca311;
	max-width: 500px;
	padding: 1.1em;
	margin: 0 auto;
	margin-top: 0.5%;
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

const GreenBtn = styled.button`
	border: outline 1px #fca311;
	// outline: none;
	padding: 12px 0;
	// background-color: #3bb19b;
	background-color: #04aa6d;
	// background-color: #fca311;
	border-radius: 20px;
	width: 180px;
	font-weight: bold;
	// font-size: 14px;
	font-size: 1.1em;
	cursor: pointer;
	color: #e5e5e5;

	@media (max-width: 700px) {
		width: 100px;
		font-size: 14px;
	}
`;

const Container = styled.div`
	height: 100vh;
	display: flex;
	// align-items: center;
	// justify-content: center;
	flex-direction: column;
  // margin: 0 auto;
	flex-direction: column;
	font-size: 1.1em;
	img {
			border-radius: 50%;
			width: -50%;
		}
	@media (max-width: 700px) {
		// padding-top: .01%;
	}
	@media (min-width: 700px) {
		position: 
		width: 100px;
		display: flex;
		overflow-y: scroll;
		align-items: center;
		img {
			border-radius: 50%;
		}	
	}
`;

const PasswordReset = (props) => {
  useEffect(() => {
    // update the document title
    document.title = 'Sign In — Confirm Reset Password';
  });

  function refreshPage() {
    setTimeout(() => {
      window.location.reload(false);
    }, 35);
    console.log('page to reload');
  }

  // set the default state of the form
  const [values, setValues] = useState();
  // update the state when a user types in the form
  const onChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };
  const [validUrl, setValidUrl] = useState();
  const param = useParams();
  useEffect(() => {
    const passwordResetUrl = async () => {
      try {
        // Read in user's token from the email link
        // Verify if it is an actual user
        // Show the reset form only if the user is verified
        // Update the database once the user submits the form.
        // Notify the user upon successful db update.
        // Return the user to the login screen.
        // Send a notification email that the user's password was updated? (optional)
        // Remember to delete these comments

        const url = `http://localhost:4000/${param.id}/reset/${param.token}`;
        const options = {
          method: 'GET',
          url: url,
          headers: {
            'content-type': [
              'application/json',
              'application/x-www-form-urlencoded',
            ],
            // csrfPrevention: 'false',
            // 'Apollo-Require-Preflight': 'true',
            // Authoriaztion: 'Bearer ${token}',
          },
        };

        const data = await axios(options);

        console.log(data);
        console.log(validUrl);
        if (data) {
          setValidUrl(true);
        }
        console.log(validUrl);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    passwordResetUrl();
  }, [param]);

  const navigate = useNavigate();
  const [updatePassword, {loading, error}] = useMutation(UPDATE_PASSWORD, {
    onCompleted: (data) => {
      localStorage.clear();
      navigate('/');
      console.log(data);
      refreshPage();
    },
  });

  return (
    <>
      {validUrl ? (
        <Container>
          <h1>Confirm Password Reset</h1>
          <p>
						Id:
            <br />
            {param.id}
          </p>
          <p>
						Token:
            <br />
            {param.token}
          </p>
          <Wrapper>
            <h2>Enter Your New Password</h2>
            <Form
              onSubmit={(event) => {
                event.preventDefault();
                console.log(event);
                updatePassword({
                  variables: {
                    id: param.id,
                    ...values,
                  },
                });
              }}
            >
              <>
                <label htmlFor="newPassword">New Password:</label>
                <input
                  required
                  type="password"
                  id="password"
                  name="password"
                  placeholder="new password"
                  onChange={onChange}
                />
              </>
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                required
                type="password"
                id="confirmPassword"
                name="confirm Password"
                placeholder="confirm password"
                onChange={onChange}
              />
              <Button type="submit">Submit</Button>
            </Form>
          </Wrapper>
        </Container>
      ) : (
        <div>
          <h1>Password Reset Link Not Found or Invalid</h1>
          <p></p>
          <h2>Please Try again.</h2>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {/* if there is an error, display a error message*/}{' '}
      {error && <p>Error updating password!</p>}
    </>
  );
};

export default PasswordReset;
