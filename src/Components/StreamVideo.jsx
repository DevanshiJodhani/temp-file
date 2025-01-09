import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import API from '../api';
import { UserContext } from '../Context/UserContext';
import Alert from './Alert';

const StreamVideo = () => {
  const { videoId } = useParams();
  const { user } = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [commentLikes, setCommentLikes] = useState([]);
  const [commentDislikes, setCommentDislikes] = useState([]);
  const [visibleDeleteIndex, setVisibleDeleteIndex] = useState(null);
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [createComment, setCreateComment] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [alert, setAlert] = useState({
    message: '',
    isOpen: false,
    redirectTo: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetching video data
    const fetchVideo = async () => {
      try {
        const response = await API.get(`/api/v1/videos/${videoId}`);
        const fetchedVideo = response.data.video;
        setVideo(fetchedVideo);

        setIsLiked(fetchedVideo.isLiked || false);
        setIsDisliked(fetchedVideo.isDisliked || false);

        if (user) {
          const subscriptionResponse = await API.get(
            `/api/v1/subscriptions/c/${fetchedVideo.owner._id}`
          );
          setIsSubscribed(subscriptionResponse.data.subscribed);
        }
      } catch (error) {
        console.error('Error while fetching the video details: ', error);
      }
    };

    // Fetching Comments of this video
    const fetchComments = async () => {
      try {
        const response = await API.get(`/api/v1/comments/${videoId}`);
        const fetchedComments = response.data.data.commentsData;
        setComments(fetchedComments); // set comments in state
        setCommentLikes(fetchedComments.map((comment) => comment.isLiked)); // Initialize likes state
        setCommentDislikes(
          fetchedComments.map((comment) => comment.isDisliked)
        ); // Initialize dislike state
      } catch (error) {
        console.error('Error while fetching the video comments: ', error);
      }
    };

    fetchVideo();
    fetchComments();
  }, [videoId, user]);

  // Toggle subscribed button
  const handleSubscriptionToggle = async () => {
    try {
      const response = await API.post(
        `/api/v1/subscriptions/c/${video.owner._id}`
      );
      const newSubscriberStatus = response.data.subscribed;
      setIsSubscribed(newSubscriberStatus);

      setVideo((prevVideo) => ({
        ...prevVideo,
        owner: {
          ...prevVideo.owner,
          subscribersCount: newSubscriberStatus
            ? prevVideo.owner.subscribersCount + 1
            : prevVideo.owner.subscribersCount - 1,
        },
      }));
    } catch (error) {
      console.error('Error while subscribing to the channel: ', error);
    }
  };

  // Toggle Video Like
  const handleLikeClick = async () => {
    try {
      const response = await API.post(`/api/v1/likes/toggle/v/like/${videoId}`);
      const { isLiked } = response.data;

      setIsLiked(isLiked);

      setVideo((prevVideo) => ({
        ...prevVideo,
        likesCount: isLiked
          ? prevVideo.likesCount + 1
          : prevVideo.likesCount - 1,
        dislikesCount:
          isDisliked && isLiked
            ? prevVideo.dislikesCount - 1
            : prevVideo.dislikesCount,
      }));

      // If like is activated, ensure dislike is deactivated
      if (isLiked) {
        setIsDisliked(false);
      }
    } catch (error) {
      console.error('Error toggling like on video: ', error);
    }
  };

  // Toggle Video Dislike
  const handleDislikeClick = async () => {
    try {
      const response = await API.post(
        `/api/v1/likes/toggle/v/dislike/${videoId}`
      );
      const { isDisliked } = response.data;

      setIsDisliked(isDisliked);

      setVideo((prevVideo) => ({
        ...prevVideo,
        dislikesCount: isDisliked
          ? prevVideo.dislikesCount + 1
          : prevVideo.dislikesCount - 1,
        likesCount:
          isDisliked && isLiked
            ? prevVideo.likesCount - 1
            : prevVideo.likesCount,
      }));

      // If dislike is activated, ensure like is deactivated
      if (isDisliked) {
        setIsLiked(false);
      }
    } catch (error) {
      console.error('Error toggling dislike on video: ', error);
    }
  };

  // Toggle Comments Like
  const toggleCommentLike = async (index, commentId) => {
    try {
      const response = await API.post(
        `/api/v1/likes/toggle/c/like/${commentId}`
      );
      const { isLiked } = response.data;

      setCommentLikes((prevLikes) =>
        prevLikes.map((like, i) => (i === index ? isLiked : like))
      );

      setCommentDislikes((prevDislikes) =>
        prevDislikes.map((dislike, i) => (i === index ? false : dislike))
      );

      setComments((prevComments) =>
        prevComments.map((comment, i) => {
          if (i === index) {
            return {
              ...comment,
              totalLikes: isLiked
                ? comment.totalLikes + 1
                : comment.totalLikes - 1,
              totalDislikes:
                commentDislikes[i] && isLiked
                  ? comment.totalDislikes - 1
                  : comment.totalDislikes,
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error('Error toggling like on comment: ', error);
    }
  };

  // Toggle comments dislike
  const toggleCommentDislike = async (index, commentId) => {
    try {
      const response = await API.post(
        `/api/v1/likes/toggle/c/dislike/${commentId}`
      );
      const { isDisliked } = response.data;

      setCommentDislikes((prevDislikes) =>
        prevDislikes.map((dislike, i) => (i === index ? isDisliked : dislike))
      );

      setCommentLikes((prevLikes) =>
        prevLikes.map((like, i) => (i === index ? false : like))
      );

      setComments((prevComments) =>
        prevComments.map((comment, i) => {
          if (i === index) {
            return {
              ...comment,
              totalDislikes: isDisliked
                ? comment.totalDislikes + 1
                : comment.totalDislikes - 1,
              totalLikes:
                commentLikes[i] && isDisliked
                  ? comment.totalLikes - 1
                  : comment.totalLikes,
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error('Error toggling dislike on comment: ', error);
    }
  };

  // Create commnet functioanlity
  const handleCommentSubmit = async () => {
    if (!createComment.trim()) return;

    try {
      const response = await API.post(`/api/v1/comments/${videoId}`, {
        content: createComment,
      });

      const newComment = response.data.comment;
      setComments((prevComments) => [newComment, ...prevComments]);
      setCreateComment('');
    } catch (error) {
      console.error('Error while creating comment: ', error);
    }
  };

  //  Show/Hide delete button
  const toggleDeleteButton = (index) => {
    setVisibleDeleteIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // Delete comment functionality
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await API.delete(`/api/v1/comments/c/${commentId}`);
      const { commentId: deletedCommentId } = response.data;

      // emoev comment from all comment array
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== deletedCommentId)
      );
    } catch (error) {
      console.error('Error while deleting comment: ', error);
    }
  };

  // Toggle Delete video
  const handleDeleteVideo = async () => {
    try {
      await API.delete(`/api/v1/videos/${videoId}`);
      setAlert({
        message: 'Video Deleted successfully',
        isOpen: true,
        redirectTo: '/home',
      });
    } catch (error) {
      console.error('Error deleting video: ', error);
    }
  };

  // Navigate to edit video page
  const handleEditVideoClick = () => {
    navigate(`/edit/${videoId}`, { state: { video } });
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
      {video && (
        <>
          <Content>
            <VideoPlayer>
              <video src={video.streamUrl} controls></video>
            </VideoPlayer>
            <Description>
              <h3>Description</h3>
              <span>
                <p>{video.views} views</p> •{' '}
                <p>{new Date(video.createdAt).toLocaleDateString()}</p>
              </span>
              <Details>
                <p>{video.description}</p>
              </Details>
            </Description>
          </Content>
          <Title>
            <h2>{video.title}</h2>
          </Title>
          <Information>
            <Info>
              <User>
                <img src={video.owner.avatar} alt="" />
              </User>
              <UserInfo>
                <h3>{video.owner.name}</h3>
                <p>{video.owner.subscribersCount} subscribers</p>
              </UserInfo>
              {user?._id === video.owner._id ? (
                <>
                  <Button onClick={handleEditVideoClick}>Edit Video</Button>
                  <DeleteVideo onClick={handleDeleteVideo}>
                    Delete Video
                  </DeleteVideo>
                </>
              ) : (
                <Button
                  onClick={handleSubscriptionToggle}
                  isSubscribed={isSubscribed}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </Button>
              )}
            </Info>
            <LikeComponent>
              <Like onClick={handleLikeClick}>
                <i className={isLiked ? 'bx bxs-like' : 'bx bx-like'}></i>
                <span>{video.likesCount}</span>
              </Like>
              <Unlike onClick={handleDislikeClick}>
                <i
                  className={isDisliked ? 'bx bxs-dislike' : 'bx bx-dislike'}
                ></i>
              </Unlike>
            </LikeComponent>
          </Information>

          <CommentComponent>
            <CreateComment>
              <User>
                <img src={user?.avatar || '/images/user.svg'} alt="Avatar" />
              </User>
              <InputField>
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={createComment}
                  onChange={(e) => setCreateComment(e.target.value)}
                />
              </InputField>
              <button onClick={handleCommentSubmit}>Comment</button>
            </CreateComment>

            <AllComment>
              {comments.map((comment, index) => (
                <CommentBox key={comment._id}>
                  <Box>
                    <Left>
                      <User>
                        <img
                          src={comment.owner.avatar || '/images/user.svg'}
                          alt=""
                        />
                      </User>
                      <CommentDetails>
                        <h4>{comment.owner.name}</h4>
                        <p>{comment.content}</p>
                        <CommentLikeComponent>
                          <CommentLike
                            onClick={() =>
                              toggleCommentLike(index, comment._id)
                            }
                          >
                            <i
                              className={
                                commentLikes[index]
                                  ? 'bx bxs-like'
                                  : 'bx bx-like'
                              }
                            ></i>
                            <span>{comment.totalLikes}</span>
                          </CommentLike>
                          <CommentUnlike
                            onClick={() =>
                              toggleCommentDislike(index, comment._id)
                            }
                          >
                            <i
                              className={
                                commentDislikes[index]
                                  ? 'bx bxs-dislike'
                                  : 'bx bx-dislike'
                              }
                            ></i>
                          </CommentUnlike>
                        </CommentLikeComponent>
                      </CommentDetails>
                    </Left>
                    <Right>
                      <i
                        class="bx bx-dots-vertical-rounded"
                        onClick={() => toggleDeleteButton(index)}
                      ></i>
                      {visibleDeleteIndex === index && (
                        <Delete
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          Delete
                        </Delete>
                      )}
                    </Right>
                  </Box>
                </CommentBox>
              ))}
            </AllComment>
          </CommentComponent>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: auto;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 25px;
`;

const VideoPlayer = styled.div`
  max-width: 1000px;
  width: 100%;
  aspect-ratio: 16/9;
  border: 2px solid #111;
  border-radius: 10px;
  overflow: hidden;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const Description = styled.div`
  max-width: 500px;
  width: 100%;
  min-height: 550px;
  height: 100%;
  border: 2px solid #111;
  border-radius: 10px;
  padding: 20px;

  h3 {
    margin-bottom: 20px;
    color: #aaa;
    letter-spacing: 1px;
  }

  span {
    display: flex;
    margin-bottom: 10px;
    gap: 10px;
    font-size: 18px;
    color: #808080;
    font-weight: 700;
  }
`;

const Details = styled.div`
  margin-top: 20px;
  letter-spacing: 1px;
  text-align: justify;
  line-height: 1.5;
`;

const Title = styled.div`
  margin-top: 20px;
  max-width: 1000px;
  line-height: 1.5;
`;

const Information = styled.div`
  max-width: 1000px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const Info = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const User = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const UserInfo = styled.div`
  margin-left: 20px;
  flex: 1;
  overflow: hidden;

  h3 {
    margin-bottom: 10px;
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 40px;
  padding: 16px 30px;
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  border-radius: 10px;
  background-color: ${({ isSubscribed }) =>
    isSubscribed ? '#444444' : '#ff0000'};
  &:hover {
    opacity: 0.8;
  }
`;

const DeleteVideo = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  padding: 14px 20px;
  border: none;
  outline: none;
  border-radius: 50px;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  background: #ff0000;
`;

const LikeComponent = styled.div`
  padding: 16px 30px;
  background: #ffffff5f;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  cursor: pointer;
`;

const Like = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #aaa;

  i {
    font-size: 30px;
  }
  span {
    margin: 0 10px;
    font-size: 20px;
  }
`;

const Unlike = styled.div`
  margin: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    font-size: 30px;
  }
`;

const CommentComponent = styled.div`
  max-width: 1000px;
  width: 100%;
  height: auto;
  padding: 20px;
  margin-top: 30px;
  border: 2px solid #111;
  border-radius: 10px;
`;

const CreateComment = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    padding: 12px 20px;
    border: none;
    outline: none;
    border-radius: 50px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    background: #258af5;
  }
`;
const InputField = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
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
    color: #aaa;
    background: transparent;
  }
`;

const AllComment = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 30px;
`;

const CommentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`;

const Box = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const CommentDetails = styled.div`
  margin-left: 20px;
  h4 {
    margin-bottom: 5px;
  }
`;

const CommentLikeComponent = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 50px;
  cursor: pointer;
  margin: 10px 0;
`;

const CommentLike = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #aaa;

  i {
    font-size: 22px;
  }
  span {
    margin: 0 10px;
    font-size: 16px;
  }
`;

const CommentUnlike = styled.div`
  margin: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    font-size: 20px;
  }
`;

const Right = styled.div`
  font-size: 30px;
  cursor: pointer;
  position: relative;
`;

const Delete = styled.button`
  position: absolute;
  top: 40px;
  left: -50px;
  padding: 12px 20px;
  border: none;
  outline: none;
  background: #ff0000;
  color: #fff;
  font-size: 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 700;
`;

export default StreamVideo;
