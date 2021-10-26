import styled from '@emotion/styled';

const Container = styled.div`
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 25px;
  max-width: 500px;
  min-width: 250px;
  min-height: 250px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

type Props = {
  header: string;
  subtitle: string;
  children: JSX.Element;
};

const Popup = ({ header, subtitle, children }: Props) => {
  return (
    <Container>
      <h2>{header}</h2>
      <h3>{subtitle}</h3>
      {children}
    </Container>
  );
};

export default Popup;
