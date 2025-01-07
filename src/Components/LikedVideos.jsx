import styled from 'styled-components';
import API from '../api';
import { UserContext } from '../Context/UserContext';
import { useContext, useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns'; 

const LikedVideos = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await API.get('/api/v1/likes/getAllLikedVideos');
        if (response.data?.data) {
          setLikedVideos(response.data.data);
        }
      } catch (error) {
        console.error('Error while fetching videos: ', error);
      }
    };

    if (user) {
      fetchLikedVideos();
    }
  }, [user]);

  return (
    <Container>
      <h1>Liked Videos</h1>
      <Content>
        {likedVideos.length > 0 ? (
          likedVideos.map(({ likedVideo }, index) => {
            const video = likedVideo[0]; // Extracting video details

            return (
              <VideoBox key={index}>
                <Box>
                  <img
                    src={
                      video.thumbnail.url || './images/signup-backgorund.jpg'
                    }
                    alt={video.title || 'Video thumbnail'}
                  />
                </Box>
                <Info>
                  <User>
                    <img
                      src={video.ownerDetails?.avatar || './images/user.svg'}
                      alt={video.ownerDetails?.username || 'User avatar'}
                    />
                  </User>
                  <Description>
                    <h4>{video.title || 'Untitled video'}</h4>
                    <h5>@{video.ownerDetails?.username || 'Unknown User'}</h5>
                    <span>
                      <p>{video.views || '0'} views</p> •{' '}
                      <p>
                      {formatDistanceToNow(new Date(video.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    </span>
                  </Description>
                </Info>
              </VideoBox>
            );
          })
        ) : (
          <p>No liked videos found</p>
        )}
        
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: auto;
`;

const Content = styled.div`
  width: 100%;
  height: auto;
  padding: 20px;
  display: grid;
  grid-gap: 25px;
  gap: 25px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
`;
const VideoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 500px;
  height: auto;
  cursor: pointer;
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
  margin-top: 12px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const User = styled.div`
  width: 50px;
  height: 50px;
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
  margin-left: 10px;
  flex: 1;
  overflow: hidden;

  h4 {
    text-overflow: ellipsis;
  }

  h5 {
    font-size: 16px;
    margin: 8px 0;
  }

  span {
    display: flex;
    margin-bottom: 10px;
    gap: 10px;
  }
`;

export default LikedVideos;
