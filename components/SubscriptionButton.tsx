import { MouseEventHandler } from "react";
import { formatAmountForDisplay } from "../utils/stripe-helpers";
import * as config from "../config";

import styled from "@emotion/styled";

type Props = {
  price: number;
  frequency: string;
  handleClick: MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
};

const Button = styled.button`
  padding: 10px;
  background: white;
  margin: 10px;
  cursor: pointer;
  flex: 1 0 calc(33.33% - 20px);
  width: 50px;
  transition: all 0.1s ease;
  border-radius: 6px;
  border-style: unset;
  &:hover:enabled {
    filter: drop-shadow(0px 4px 3px rgba(0, 0, 0, 0.5));
  }
`;

const SubscriptionButton = ({
  price,
  frequency,
  handleClick,
  disabled = false,
}: Props) => {
  return (
    <Button type="submit" onClick={handleClick} disabled={disabled}>
      Subscribe at {formatAmountForDisplay(price, config.CURRENCY)} every{" "}
      {frequency}
    </Button>
  );
};

export default SubscriptionButton;
