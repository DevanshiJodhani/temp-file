import styled from 'styled-components';
import { useState, useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import API from '../api';
import Alert from './Alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({
    message: '',
    isOpen: false,
    redirectTo: null,
  });

  const { setUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post(
        '/api/v1/users/login',
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          
        }
      );

      setUser(response.data.loggedUser);
      setAlert({
        message: 'Successfully logged in!',
        isOpen: true,
        redirectTo: '/home',
      });
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || 'Something went wrong!',
        isOpen: true,
      });
    }
  };

  return (
    <Container>
      {alert.isOpen && (
        <Alert
          message={alert.message}
          onClose={() => setAlert({ ...alert, isOpen: false })}
          redirectTo={alert.redirectTo}
        />
      )}
      <Content>
        <Heading>Sign In</Heading>
        <Form onSubmit={handleLogin}>
          <InputField>
            <i class="bx bxs-envelope"></i>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </InputField>
          <InputField>
            <i class="bx bxs-lock-alt"></i>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </InputField>
          <span>
            Don't have an account? <a href="/signup">SignUp</a>
          </span>
          <Button type="submit">Sing In</Button>
        </Form>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('./images/signup-backgorund.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

const Content = styled.div`
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Heading = styled.h1`
  margin: 10px;
  color: #ff0000;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px;
  width: 100%;

  span {
    margin: 10px;
    color: #808080;
    font-weight: 900;
  }
`;

const InputField = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  border: 1px solid #111;
  padding: 15px;
  margin: 8px;
  border-radius: 25px;

  input {
    width: 100%;
    height: 100%;
    font-size: 16px;
    border: none;
    outline: none;
    color: #111;
  }

  i {
    margin-right: 10px;
    font-size: 25px;
    color: #ff0000;
  }
`;

const Button = styled.button`
  padding: 14px 30px;
  background: #2587e8;
  border: none;
  outline: none;
  font-size: 20px;
  font-weight: 600;
  margin: 10px;
  color: #fff;
  border-radius: 15px;
  cursor: pointer;
`;

export default Login;
