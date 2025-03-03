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
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const AlertContainer = styled.div`
  background: linear-gradient(135deg, #0d1117, #131921);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 350px;
  color: #fff;
`;

const Message = styled.p`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #ffcc00;
`;

const Button = styled.button`
  margin-top: 35px;
  padding: 16px 30px;
  background: #007bff;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
  
  &:hover {
    background: #005ec3;
  }
`;

export default Alert;