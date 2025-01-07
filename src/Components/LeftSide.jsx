import styled from 'styled-components';

const LeftSide = () => {
  return (
    <Container>
      <Content>
        <NavLinks>
          <ul>
            <li>
              <i className="bx bxs-home"></i>
              <a href="/home">Home</a>
            </li>
            <li>
              <i className="bx bxs-videos"></i>
              <a href="/subscription">Subscription</a>
            </li>
            <li>
              <i className="bx bxs-like"></i>
              <a href="/likedVideos">Liked Videos</a>
            </li>
            <li>
              <i className="bx bx-history"></i>
              <a href="/history">History</a>
            </li>
            <li>
              <i className="bx bxl-youtube"></i>
              <a href="/your-videos">Your Videos</a>
            </li>
          </ul>
        </NavLinks>
        <EditProfile>
          <a href='/settings'>
            <i class="bx bxs-cog"></i>
            <h4>Settings</h4>
          </a>
        </EditProfile>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  color: #fff;
  background: #000;
`;

const Content = styled.div`
  padding: 30px;
`;

const NavLinks = styled.div`
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  ul {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;

    li {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 16px;
      border-radius: 50px;
      margin: 15px 0;
      cursor: pointer;

      a {
        font-size: 20px;
        margin-left: 15px;
        text-decoration: none;
        color: #fff;
      }
      i {
        font-size: 25px;
      }

      &:hover {
        background: #ffffff5f;
      }
    }
  }
`;

const EditProfile = styled.div`
  position: absolute;
  bottom: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 30px;
    border: none;
    outline: none;
    background: #fff;
    border-radius: 15px;
    cursor: pointer;
    text-decoration: none;
    color: #000;

    h4 {
      font-size: 18px;
      font-weight: 700;
      margin-left: 10px;
    }

    i {
      font-size: 25px;
    }
  }
`;

export default LeftSide;
