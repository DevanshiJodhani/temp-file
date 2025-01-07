import styled from 'styled-components';
import API from '../api';
import { UserContext } from '../Context/UserContext';
import { useContext, useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const History = () => {
  const [watchHistory, setWatchHistory] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        const response = await API.get(`/api/v1/users/${user._id}/getHistory`);

        if (response.data?.data) {
          setWatchHistory(response.data.data);
        }
      } catch (error) {
        console.error('Error while fetching watch history: ', error);
      }
    };

    if (user) {
      fetchWatchHistory();
    }
  }, [user]);

  return (
    <Container>
      <h1>Your History</h1>
      {watchHistory.length > 0 ? (
        <MainBox>
          {watchHistory.map((video) => (
            <VideoItem key={video._id}>
              <Box>
                <img
                  src={video.thumbnail.url || './images/signup-backgorund.jpg'}
                  alt={video.title}
                />
              </Box>
              <Info>
                <User>
                  <img
                    src={video.owner.avatar || './images/user.svg'}
                    alt={video.owner.username}
                  />
                </User>
                <Description>
                  <h4>{video.title}</h4>
                  <h5>@{video.owner.username}</h5>
                  <a>{video.description}</a>
                  <span>
                    <p>{video.views} views</p> •{' '}
                    <p>
                      {formatDistanceToNow(new Date(video.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </span>
                </Description>
              </Info>
            </VideoItem>
          ))}
        </MainBox>
      ) : (
        <p>No watch history found</p>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: auto;
`;

const MainBox = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
  margin: 20px 0;
  cursor: pointer;
`;

const VideoItem = styled.div`
  display: flex;
  margin-bottom: 20px;
  width: 100%;
`;

const Box = styled.div`
  max-width: 500px;
  height: 300px;
  width: 100%;
  border: 2px solid #111;
  border-radius: 10px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const Info = styled.div`
  margin: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const User = styled.div`
  width: 55px;
  height: 55px;
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

const Description = styled.div`
  margin-left: 20px;
  flex: 1;
  overflow: hidden;

  h4 {
    text-overflow: ellipsis;
  }

  h5 {
    font-size: 16px;
    margin: 8px 0;
  }
  a {
    display: -webkit-box;
    -webkit-line-clamp: 2; // Limit 2 lines
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }

  span {
    display: flex;
    margin: 10px 0;
    gap: 10px;
  }
`;

export default History;
