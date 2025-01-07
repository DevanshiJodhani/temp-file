import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Alert = ({ message, onClose, redirectTo }) => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    onClose();
    if (redirectTo) {   
      navigate(redirectTo);
    }
  };

  return (
    <Overlay>
      <AlertContainer>
        <Message>{message}</Message>
        <Button onClick={handleOkClick}>OK</Button>
      </AlertContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const AlertContainer = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Message = styled.p`
  margin: 0;
  font-size: 22px;
  color: #333;
`;

const Button = styled.button`
  margin-top: 30px;
  padding: 16px 30px;
  background: #007bff;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

export default Alert;