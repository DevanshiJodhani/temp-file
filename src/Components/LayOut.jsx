import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import LeftSide from './LeftSide';

const Layout = ({ children }) => {
  return (
    <Container>
      <Header />
      <Content>
        <Left>
          <LeftSide />
        </Left>
        <Right>{children}</Right>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  flex: 1;                                  
`;

const Left = styled.div`
  position: sticky;
  top: 100px;
  width: 300px;
  height: calc(100vh - 100px);
  overflow-y: auto;
`;

const Right = styled.div`
  flex: 1;
  overflow-y: auto;
  background: #000;
  padding: 30px;
`;

export default Layout;
