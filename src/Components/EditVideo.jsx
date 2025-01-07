import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Alert from './Alert';
import API from '../api';

const EditVideo = () => {
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [publishStatus, setPublishStatus] = useState(false);
  const [alert, setAlert] = useState({
    message: '',
    isOpen: false,
    redirectTo: null,
  });

  const thumbnailInputRef = useRef(null);

  useEffect(() => {
    if (location.state?.video) {
      const videoData = location.state.video;
      setVideo(videoData);

      // Populate form fields with exsiting data
      setTitle(videoData.title);
      setDescription(videoData.description);
      setPublishStatus(videoData.publishStatus);
      if (videoData.thumbnail) {
        setThumbnail({ url: videoData.thumbnail.url });
      }
    }
  }, [location.state]);

  const handleThumbnailUploadClick = () => {
    thumbnailInputRef.current.click();
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  };

  const handlePublishStatusChange = (e) => {
    setPublishStatus(e.target.value === 'true');
  };

  const handleUpdateVideo = async () => {
    // Prepare form data to send
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (thumbnail instanceof File) formData.append('thumbnail', thumbnail);
    formData.append('isPublished', publishStatus);

    try {
      const response = await API.patch(`/api/v1/videos/${video._id}`, formData);
      setAlert({
        message: 'Video Updated successfully',
        isOpen: true,
        redirectTo: '/home',
      });
    } catch (error) {
      console.error('Error updating video:', error);
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
      <h1>Update Video Details</h1>
      <Content>
        <Left>
          <InputField>
            <input
              type="text"
              placeholder="Title (Required)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </InputField>
          <TextareaField>
            <textarea
              name="message"
              placeholder="Description (required)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </TextareaField>
          <Thumbnail>
            <UploadThumbnail>
              <h4>Thumbnail</h4>
              <Box onClick={handleThumbnailUploadClick}>
                {thumbnail ? (
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    alt="Thumbnail preview"
                  />
                ) : (
                  <i className="bx bxs-camera"></i>
                )}
              </Box>
              <input
                type="file"
                ref={thumbnailInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleThumbnailChange}
              />
            </UploadThumbnail>
            <PublishStatus>
              <h4>Publish Status</h4>
              <Select
                value={publishStatus}
                onChange={handlePublishStatusChange}
              >
                <option value={false}>False</option>
                <option value={true}>True</option>
              </Select>
            </PublishStatus>
          </Thumbnail>
          <Button onClick={handleUpdateVideo}>Update Video</Button>
        </Left>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: auto;
`;

const Content = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 25px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  gap: 25px;
`;

const InputField = styled.div`
  width: 100%;
  height: 80px;
  border: 1px solid #222;
  border-radius: 10px;
  overflow: hidden;

  input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    padding: 15px;
    font-size: 18px;
    color: #fff;
  }
`;

const TextareaField = styled.div`
  width: 100%;
  height: 300px;
  border: 1px solid #222;
  border-radius: 10px;
  overflow: hidden;

  textarea {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    padding: 15px;
    font-size: 18px;
    color: #fff;
    resize: none;
  }

  textarea::-webkit-scrollbar {
    width: 1px;
  }

  textarea::-webkit-scrollbar-thumb {
    background-color: #aaa;
  }

  textarea::-webkit-scrollbar-track {
    background-color: #000;
  }
`;

const Thumbnail = styled.div`
  display: flex;
  gap: 60px;
`;

const UploadThumbnail = styled.div`
  h4 {
    font-size: 20px;
  }
`;

const Box = styled.div`
  width: 400px;
  height: 200px;
  border: 1px solid #222;
  margin-top: 15px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  i {
    font-size: 35px;
    color: #fff;
  }

  img {
    width: 100%;
    height: 100%;
    object-position: center;
    object-fit: cover;
  }
`;

const Button = styled.button`
  padding: 16px 30px;
  border: none;
  outline: none;
  background: #0d7aff;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  letter-spacing: 1px;
`;

const PublishStatus = styled.div`
  margin-top: 20px;

  h4 {
    font-size: 20px;
  }
`;

const Select = styled.select`
  margin-top: 10px;
  width: 200px;
  height: 50px;
  border: none;
  outline: none;
  border-radius: 10px;
  background: #fff;
  color: #000;
  padding: 10px;
  appearance: none;
  font-size: 16px;
  cursor: pointer;
`;

export default EditVideo;
