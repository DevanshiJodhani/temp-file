import styled from 'styled-components';
import API from '../api.js';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from '../Context/UserContext.jsx';
import Search from './Search.jsx';

const Header = () => {
  const [isUserInfoVisible, setIsUserInfoVisible] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const toggleUserInfo = () => {
    setIsUserInfoVisible(!isUserInfoVisible);
  };

  const handleLogout = async () => {
    try {
      // Call the logout api end point
      const response = await API.post('/api/v1/users/logout');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Content>
        <Logo>
          <img src="./images/logo.png" alt="" />
          <span>ReelHive</span>
        </Logo>
        <SearchContent>
          <Search />
        </SearchContent>
        <UserProfile>
          <CreateVideo href="/publish-video">
            <i class="bx bx-plus"></i>
            <span>Create</span>
          </CreateVideo>
          <User onClick={toggleUserInfo}>
            <img
              src={user?.avatar || '/images/user.svg'} 
              alt="User Avatar"
            />
            {isUserInfoVisible && (
              <UserInfo>
                <Channel>
                  <ProfileImage>
                    <img
                      src={user?.avatar || '/images/user.svg'} 
                      alt="User Avatar"
                    />
                  </ProfileImage>
                  <Info>
                    <h4>{user?.name || 'Guest'}</h4>
                    <p>@{user?.username || 'username'}</p>
                    <a href="/your-videos">View your channel</a>
                  </Info>
                </Channel>

                <SignOut onClick={handleLogout}>
                  <i className="bx bx-log-in"></i>
                  <p>Sign Out</p>
                </SignOut>
              </UserInfo>
            )}
          </User>
        </UserProfile>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  z-index: 1000;
  color: #fff;
  background: #000;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 50px;
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    margin-left: 15px;
    font-size: 25px;
    font-weight: 700;
    letter-spacing: 1px;
  }
`;

const SearchContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 800px;
`;

const UserProfile = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 30px;
  align-items: center;
`;

const CreateVideo = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  padding: 12px;
  background: #dddddd4b;
  border-radius: 50px;
  text-decoration: none;
  color: #fff;

  span {
    margin-left: 10px;
    font-size: 18px;
    font-weight: 700;
  }

  i {
    font-size: 30px;
  }
`;

const UserInfo = styled.div`
  position: absolute;
  top: 80px;
  right: 30px;
  width: 300px;
  padding: 20px;
  background: #111;
  border-radius: 10px;
`;

const Channel = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #333;
`;

const ProfileImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #111;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const Info = styled.div`
  margin-left: 20px;
  p {
    margin: 10px 0;
  }

  a {
    font-weight: 600;
    color: #2382e1;
  }
`;

const User = styled.div`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #111;


  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const SignOut = styled.div`
  margin-top: 20px;
  padding: 12px 20px;
  border: none;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ff0000;
  cursor: pointer;
  border-radius: 50px;
  color: #fff;

  p {
    margin-left: 10px;
    font-size: 20px;
    font-weight: 700;
  }
  i {
    font-size: 25px;
  }
`;

export default Header;
