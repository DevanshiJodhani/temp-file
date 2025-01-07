import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns'; // For fomating relative time --> get the time when the video uplaoded
import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  // Fetch vidoes data
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await API.get('/api/v1/videos/');
        if (Array.isArray(response.data.data.videos)) {
          setVideos(response.data.data.videos);
        } else {
          console.error(
            'The videos data is not an array',
            response.data.data.videos
          );
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      }
    };
    fetchVideos();
  }, []);

  const handleVideoClick = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  return (
    <Container>
      <Content>
        {videos.length > 0 ? (
          videos.map((video) => (
            <VideoBox
              key={video._id}
              onClick={() => handleVideoClick(video._id)}
            >
              <Box>
                <img src={video.thumbnail.url} alt={video.title} />
              </Box>
              <Info>
                <User>
                  <img
                    src={video.ownerDetails.avatar || './images/user.svg'}
                    alt={video.ownerDetails.name}
                  />
                </User>
                <Description>
                  <h4>{video.title}</h4>
                  <h5>@{video.ownerDetails.username}</h5>
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
            </VideoBox>
          ))
        ) : (
          <p>No videos found.</p>
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
  grid-template-columns: repeat(4, minmax(0, 1fr));
`;
const VideoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 450px;
  height: auto;
`;

const Box = styled.div`
  max-width: 450px;
  height: 200px;
  width: 100%;
  border: 2px solid #111;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;

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
    display: -webkit-box;
    -webkit-line-clamp: 2; // Limit 2 lines
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
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

export default Home;
