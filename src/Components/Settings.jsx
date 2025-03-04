import { useRef, useState } from 'react';
import styled from 'styled-components';
import API from '../api';
import Alert from './Alert';

const Settings = () => {
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [alert, setAlert] = useState({
    message: '',
    isOpen: false,
    redirectTo: null,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
  });
  const [updatePassword, setUpdatePassword] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleAvatarClick = () => {
    avatarInputRef.current.click();
  };

  const handleCoverClick = () => {
    coverInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCover(file);
    }
  };

  // Confirming popup
  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  // Updating Avatar
  const handleUpdateAvatar = async () => {
    if (!avatar) return;

    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      await API.patch('/api/v1/users/update-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAlert({
        message: 'Avatar updated successfully',
        isOpen: true,
      });
      setAvatar(null);
    } catch (error) {
      console.error('Error while updating avatar image: ', error);
    }
  };

  // Updating Cover Image
  const handleUpdateCoverImage = async () => {
    if (!cover) return;

    const formData = new FormData();
    formData.append('coverImage', cover);

    try {
      await API.patch('/api/v1/users/update-coverImage', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAlert({
        message: 'Cover Image updated successfully',
        isOpen: true,
      });
      setCover(null);
    } catch (error) {
      console.error('Error while updating cover image: ', error);
    }
  };

  // Updating Details
  const handleUpdateDetails = async () => {
    const { name, username } = formData;
    if (!(name || username)) {
      setAlert({
        message: 'name or username is required!',
        isOpen: true,
      });
    }

    try {
      await API.patch('/api/v1/users/update-details', { name, username });
      setAlert({
        message: 'Details updated successfully',
        isOpen: true,
      });
      setFormData({ name: '', username: '' });
    } catch (error) {
      console.error('Error while updating the details: ', error);
    }
  };

  // Updating Password
  const handleUpdatePassword = async () => {
    const { currentPassword, newPassword } = updatePassword;

    try {
      await API.patch('/api/v1/users/update-password', {
        currentPassword,
        newPassword,
      });
      setAlert({
        message: 'Password updated successfully',
        isOpen: true,
      });
      setUpdatePassword({ currentPassword: '', newPassword: '' });
    } catch (error) {
      console.error('Error while updating password: ', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await API.delete('/api/v1/users/deleteMe');
      setAlert({
        message: 'Your account has been deleted successfully!',
        isOpen: true,
        redirectTo: '/',
      });
    } catch (error) {
      console.error('Error deleting account: ', error);
      setAlert({
        message: 'Error deleting account. Please try again later.',
        isOpen: true,
      });
    } finally {
      setShowDeleteConfirm(false);
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
      <Content>
        <Updater>
          <h2>Update Avatar</h2>
          <Avatar onClick={handleAvatarClick}>
            {avatar ? (
              <img src={URL.createObjectURL(avatar)} alt="Avatar Preview" />
            ) : (
              <i className="bx bxs-camera"></i>
            )}
            <input
              type="file"
              ref={avatarInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </Avatar>
          <Button onClick={handleUpdateAvatar}>Update Avatar</Button>
        </Updater>
        <Updater>
          <h2>Update Cover Image</h2>
          <CoverImage onClick={handleCoverClick}>
            {cover ? (
              <img src={URL.createObjectURL(cover)} alt="Cover Preview" />
            ) : (
              <>
                <i className="bx bxs-camera"></i>
                <span>Cover Image</span>
              </>
            )}

            <input
              type="file"
              ref={coverInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleCoverChange}
            />
          </CoverImage>
          <Button onClick={handleUpdateCoverImage}>Update Cover Image</Button>
        </Updater>
      </Content>
      <Content>
        <Updater>
          <h2>Update Details</h2>
          <UpdateDetails>
            <InputField>
              <i className="bx bxs-user-circle"></i>
              <input
                type="text"
                placeholder="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </InputField>
            <InputField>
              <i className="bx bxs-user-circle"></i>
              <input
                type="text"
                placeholder="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </InputField>
          </UpdateDetails>
          <Button onClick={handleUpdateDetails}>Update Details</Button>
        </Updater>
        <Updater>
          <h2>Update Password</h2>
          <UpdatePassword>
            <InputField>
              <i className="bx bxs-lock-alt"></i>
              <input
                type="password"
                placeholder="Current password"
                value={updatePassword.currentPassword}
                onChange={(e) =>
                  setUpdatePassword({
                    ...updatePassword,
                    currentPassword: e.target.value,
                  })
                }
              />
            </InputField>
            <InputField>
              <i className="bx bxs-lock-alt"></i>
              <input
                type="password"
                placeholder="New password"
                value={updatePassword.newPassword}
                onChange={(e) =>
                  setUpdatePassword({
                    ...updatePassword,
                    newPassword: e.target.value,
                  })
                }
              />
            </InputField>
          </UpdatePassword>
          <Button onClick={handleUpdatePassword}>Update Password</Button>
        </Updater>
      </Content>
      <Content>
        <h3>Deleting your account is permanent. Proceed with caution!</h3>
        <Button onClick={handleDeleteConfirm}>Delete Account</Button>
      </Content>

      {/* Confirmation Popup */}
      {showDeleteConfirm && (
        <PopupOverlay>
          <Popup>
            <p>Are you sure you want to delete your account?</p>
            <PopupButtons>
              <ConfirmButton onClick={handleDeleteAccount}>Yes</ConfirmButton>
              <CancelButton onClick={() => setShowDeleteConfirm(false)}>
                No
              </CancelButton>
            </PopupButtons>
          </Popup>
        </PopupOverlay>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: auto;
  color: #000;
`;

const Content = styled.div`
  max-width: 900px;
  width: 100%;
  height: auto;
  background: #fff;
  border-radius: 10px;
  padding: 40px;
  margin: 40px auto;
  display: flex;
  justify-content: space-between;

  h3 {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
  }
`;

const Updater = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;
`;

const Avatar = styled.div`
  width: 150px;
  height: 150px;
  border: 1px solid #ff0000;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  i {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    text-decoration: none;
    color: #111;
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
  background: #ff0000;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  border-radius: 15px;
  cursor: pointer;

  &:hover {
    background: #f22f2f;
  }
`;

const CoverImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  border: 1px solid #ff0000;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;

  i {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    text-decoration: none;
    color: #111;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }

  span {
    margin-top: 10px;
  }
`;

const UpdateDetails = styled.div`
  max-width: 350px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InputField = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
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
    color: #111;
  }

  i {
    margin-right: 10px;
    font-size: 25px;
    color: #111;
  }
`;

const UpdatePassword = styled.div`
  max-width: 350px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Popup = styled.div`
  background: #0d1117;
  color: #ffcc00;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  font-size: 18px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const PopupButtons = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const ConfirmButton = styled.button`
  background: #ff0000;
  color: #fff;
  border: none;
  padding: 16px 30px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  &:hover {
    background: #f22f2f;
  }
`;

const CancelButton = styled(ConfirmButton)`
  background: #5bc0de;
  &:hover {
    background: #31b0d5;
  }
`;

export default Settings;
