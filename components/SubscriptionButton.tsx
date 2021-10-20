import { formatAmountForDisplay } from '../utils/stripe-helpers';
import * as config from '../config';

import styled from '@emotion/styled';

type Props = {
  price: number;
  frequency: string;
  handleClick: Function;
  loading: boolean;
};

const Button = styled.button`
  padding: 10px;
  background: white;
  margin: 10px;
  cursor: pointer;
  transition: all 0.1s ease;
  border-radius: 6px;
  border-style: unset;
  &:hover {
    filter: drop-shadow(0px 4px 3px rgba(0, 0, 0, 0.5));
  }
`;

const SubscriptionButton = ({
  price,
  frequency,
  handleClick,
  loading = false,
}: Props) => {
  return (
    <Button type="submit" onClick={handleClick} disabled={loading}>
      Subscribe at {formatAmountForDisplay(price, config.CURRENCY)} every{' '}
      {frequency}
    </Button>
  );
};

export default SubscriptionButton;
