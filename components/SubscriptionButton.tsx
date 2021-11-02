import { MouseEventHandler } from "react";
import { formatAmountForDisplay } from "../utils/stripe-helpers";
import * as config from "../config";
import Button from "./Button";

type Props = {
  price: number;
  frequency: string;
  handleClick: MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
};

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
