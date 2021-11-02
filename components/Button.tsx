import styled from "@emotion/styled";

const Button = styled.button`
  padding: 10px;
  background: white;
  margin: 10px;
  cursor: pointer;
  flex: 1 0 calc(33.33% - 20px);
  transition: all 0.1s ease;
  border-radius: 6px;
  border-style: unset;
  &:hover:enabled {
    filter: drop-shadow(0px 4px 3px rgba(0, 0, 0, 0.5));
  }
`;

export default Button;
