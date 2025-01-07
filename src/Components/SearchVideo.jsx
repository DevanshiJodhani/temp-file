import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import API from '../api';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const SearchVideo = () => {
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [channels, setChannels] = useState([]);

  // Extract query from URL
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    // Fetching search videos
    const fetchVideos = async () => {
      try {
        const response = await API.get(`/api/v1/searches?query=${query}`);
        const { videos, channels } = response.data.data;

        setVideos(videos);
        setChannels(channels);
      } catch (error) {
        console.error('Error while fetching searched videos: ', error);
      }
    };
    if (query) {
      fetchVideos();
    }
  }, [query]);

  const hasVideos = videos.length > 0;
  const hasChannels = channels.length > 0;

  return (
    <Container>
      <MainBox>
        {hasVideos &&
          videos.map((video) => (
            <VideoItem key={video._id}>
              <Box>
                <img src={video.thumbnail.url} alt={video.title} />
              </Box>
              <Info>
                <User>
                  <img src={video.ownerDetails.avatar} alt={video.title} />
                </User>
                <Description>
                  <h4>{video.title}</h4>
                  <h5>{video.ownerDetails.username}</h5>
                  <span>
                    <p>{video.views} views</p>•{' '}
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

        {hasChannels &&
          channels.map((channel) => (
            <ChannelItem key={channel._id}>
              <ChannelBox>
                <ChannelLogo>
                  <img src={channel.avatar} alt={channel.name} />
                </ChannelLogo>
              </ChannelBox>
              <Info>
                <Description>
                  <h2>{channel.name}</h2>
                  <h3>
                    <p>@{channel.username}</p>•
                    <p>{channel.subscriberCount} subscribers</p>
                  </h3>
                </Description>
              </Info>
            </ChannelItem>
          ))}

        {!hasVideos && !hasChannels && <h1>No videos or channels found</h1>}
      </MainBox>
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

  span,
  h3 {
    display: flex;
    margin: 10px 0;
    gap: 10px;
  }
`;

const ChannelItem = styled.div`
  display: flex;
  margin-bottom: 20px;
  width: 100%;
`;

const ChannelBox = styled.div`
  width: 500px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChannelLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 1px solid #111;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: centerl;
  }
`;

export default SearchVideo;
