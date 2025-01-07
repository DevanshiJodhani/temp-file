import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context/UserContext';
import styled from 'styled-components';
import API from '../api';
import { formatDistanceToNow } from 'date-fns';

const Subscription = () => {
  const { user } = useContext(UserContext);
  const [subscribedChannels, setSubscribedChannels] = useState([]);

  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      try {
        const response = await API.get(
          `/api/v1/subscriptions/u/${user._id}`
        );
        setSubscribedChannels(response.data.subscribedChannels);
      } catch (error) {
        console.error(
          "Error while fetching the subscribed channel's videos: ",
          error
        );
      }
    };

    fetchSubscribedChannels();
  }, [user]);

  return (
    <Container>
      <h1>Latest Videos</h1>
      <Content>
        {subscribedChannels.map((channel) => (
          <VideoBox key={channel._id}>
            <Box>
              <img src={channel.latestVideo.thumbnail.url} alt={channel.name} />
            </Box>
            <Info>
              <User>
                <img src={channel.avatar} alt={channel.name} />
              </User>
              <Description>
                <h4>{channel.latestVideo.title}</h4>
                <h5>@{channel.username}</h5>
                <span>
                  <p>{channel.latestVideo.views} views</p> •{' '}
                  <p>
                  <p>
                      {formatDistanceToNow(new Date(channel.latestVideo.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </p>
                </span>
              </Description>
            </Info>
          </VideoBox>
        ))}
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

export default Subscription;
