import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Search = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${query}`);
    }
  };

  const handleKeyEnter = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container>
      <InputField>
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyEnter}
        />
        <i class="bx bx-search" onClick={handleSearch}></i>
      </InputField>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const InputField = styled.div`
  width: 100%;
  height: 50px;
  border: 2px solid #333;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  overflow: hidden;

  input {
    width: 720px;
    height: 100%;
    font-size: 18px;
    padding: 20px;
    letter-spacing: 1px;
    border: none;
    outline: none;
    overflow: hidden;
    background: #111;
    font-weight: 800;
    color: #fff;

    &::placeholder {
      font-weight: 800;
      letter-spacing: 1px;
    }
  }

  i {
    height: 100%;
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    background: #dddddd4b;
    cursor: pointer;
  }
`;

export default Search;
