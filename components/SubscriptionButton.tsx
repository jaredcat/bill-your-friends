import { formatAmountForDisplay } from '../utils/stripe-helpers';
import * as config from '../config';

type Props = {
  price: number;
  frequency: string;
  handleClick: Function;
};

const SubscriptionButton = (props: Props) => {
  const { price, frequency, handleClick } = props;

  return (
    <div onClick={handleClick}>
      Subscribe at {formatAmountForDisplay(price, config.CURRENCY)} every{' '}
      {frequency}
    </div>
  );
};

export default SubscriptionButton;
