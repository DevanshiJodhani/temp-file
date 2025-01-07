import { useState, useRef, useContext } from 'react';
import styled from 'styled-components';
import API from '../api.js';
import Alert from './Alert.jsx';
import { UserContext } from '../Context/UserContext.jsx';

const SignUp = () => {
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [alert, setAlert] = useState({
    message: '',
    isOpen: false,
    redirectTo: null,
  });
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const { setUser } = useContext(UserContext);


  const handleAvatarClick = () => {
    avatarInputRef.current.click();
  };

  const handleCoverClick = () => {
    coverInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file); // Save the atual file
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCover(file); // Save the atual file
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, username, email, password } = formData;
    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('username', username);
    formDataToSend.append('email', email);
    formDataToSend.append('password', password);

    //  Append the file directly
    if (avatar) formDataToSend.append('avatar', avatar);
    if (cover) formDataToSend.append('coverImage', cover);

    try {
      const response = await API.post('/api/v1/users/signup', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUser(response.data.data.createdUser);

      setAlert({
        message: 'Sign Up successfully',
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
        <ImageUploader>
          <AvatarImage onClick={handleAvatarClick}>
            {avatar ? (
              <img src={URL.createObjectURL(avatar)} alt="Avatar Preview" />
            ) : (
              <i className="bx bxs-camera"></i>
            )}
            <input
              type="file"
              ref={avatarInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </AvatarImage>
          <CoverImage onClick={handleCoverClick}>
            {cover ? (
              <img src={URL.createObjectURL(cover)} alt="Cover Preview" />
            ) : (
              <>
                <i className="bx bxs-camera"></i>

                <span>Cover Image</span>
              </>
            )}
            <input
              type="file"
              ref={coverInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleCoverChange}
            />
          </CoverImage>
        </ImageUploader>
        <Heading>Sign Up</Heading>
        <Form onSubmit={handleSubmit}>
          <InputField>
            <i className="bx bxs-user-circle"></i>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
            />
          </InputField>
          <InputField>
            <i className="bx bxs-user-circle"></i>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
            />
          </InputField>
          <InputField>
            <i className="bx bxs-envelope"></i>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </InputField>
          <InputField>
            <i className="bx bxs-lock-alt"></i>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
          </InputField>
          <span>
            Already have an account? <a href="/">SignIn</a>
          </span>
          <Button type="submit">Sign Up</Button>
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

const ImageUploader = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
`;

const CoverImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  border: 1px solid #111;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;

  i {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    text-decoration: none;
    color: #111;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }

  span {
    margin-top: 10px;
  }
`;

const AvatarImage = styled.div`
  width: 120px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #111;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;

  i {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    text-decoration: none;
    color: #111;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Heading = styled.h1`
  margin: 12px;
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

export default SignUp;
