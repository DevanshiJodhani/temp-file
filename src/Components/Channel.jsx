import styled from 'styled-components';
import API from '../api';
import { formatDistanceToNow } from 'date-fns'; // For fomating relative time --> get the time when the video uplaoded
import { UserContext } from '../Context/UserContext';
import { useContext, useEffect, useState } from 'react';

const Channel = () => {
  const [channelProfile, setChannelProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Fetch profile information
    const fetchChannelProfile = async () => {
      try {
        const response = await API.get(`/api/v1/users/c/${user.username}`);
        if (response.data?.data) {
          setChannelProfile(response.data.data);
        }
      } catch (error) {
        console.error('Error while fetching the profile details: ', error);
      }
    };

    // Fetch users created all videos
    const fetchUserVideos = async () => {
      try {
        const response = await API.get(
          `/api/v1/videos/${user.username}/getUserVideos`
        );
        if (response.data?.data?.videos) {
          setVideos(response.data.data.videos);
        }
      } catch (error) {
        console.error('Error while fetching the users videos: ', error);
      }
    };

    if (user) {
      fetchChannelProfile();
      fetchUserVideos();
    }
  }, [user]);

  return (
    <Container>
      <Content>
        <CoverImage>
          <img
            src={channelProfile?.coverImage || './images/banner.jpg'}
            alt="Cover Image"
          />
        </CoverImage>
        <Avatar>
          <Image>
            <img
              src={channelProfile?.avatar || './images/user.svg'}
              alt="Avatar"
            />
          </Image>
          <UserInfo>
            <h1>{channelProfile?.name}</h1>
            <span>
              <p>@{channelProfile?.username}</p> •{' '}
              <p>{channelProfile?.subscribersCount} subscribers</p> •
              <p>{channelProfile?.channelsSubscribedToCount} subscriptions</p>
            </span>
            <button>
              {channelProfile?.isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </UserInfo>
        </Avatar>
        <VideoList>
          {videos.length > 0 ? (
            videos.map((video) => (
              <VideoBox key={video._id}>
                <Box>
                  <img src={video.thumbnail.url} alt={video.title} />
                </Box>
                <Info>
                  <User>
                    <img
                      src={channelProfile?.avatar || './images/user.svg'}
                      alt=""
                    />
                  </User>
                  <Description>
                    <h4>{video.title}</h4>
                    <h5>@{channelProfile?.username}</h5>
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
            <p>No videos to display</p>
          )}
        </VideoList>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: auto;
`;

const Content = styled.div`
  max-width: 1300px;
  margin: auto;
  width: 100%;
  padding: 20px;
`;

const CoverImage = styled.div`
  width: 100%;
  height: 350px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #111;

  img {
    width: 100%;
    height: 100%;
    object-position: center;
    object-fit: cover;
  }
`;

const Avatar = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Image = styled.div`
  width: 200px;
  height: 200px;
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

const UserInfo = styled.div`
  margin-left: 40px;

  h1 {
    font-size: 40px;
    margin-bottom: 10px;
  }

  span {
    display: flex;
    margin-bottom: 10px;
    gap: 10px;
  }
  button {
    margin-top: 10px;
    padding: 16px 30px;
    border: none;
    outline: none;
    border-radius: 50px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
  }
`;

const VideoList = styled.div`
  width: 100%;
  height: auto;
  padding: 20px;
  display: grid;
  grid-gap: 25px;
  gap: 25px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
`;

const VideoBox = styled.div`
  margin-top: 50px;
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
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #111;

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

export default Channel;
