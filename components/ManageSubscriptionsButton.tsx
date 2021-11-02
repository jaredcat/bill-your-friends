import Button from "./Button";

type Props = {
  handleClickManageBilling: () => Promise<void>;
  customerId?: string;
  setPopupIsOpen;
};

const ManageSubscriptionsButton = ({
  customerId = "",
  handleClickManageBilling,
  setPopupIsOpen,
}: Props) => {
  let onClick = () => setPopupIsOpen(true);

  if (handleClickManageBilling && customerId) {
    onClick = handleClickManageBilling;
  }
  return (
    <Button
      css={{
        position: "absolute",
        right: 0,
        top: 0,
      }}
      onClick={onClick}
    >
      Mange Subscription
    </Button>
  );
};

export default ManageSubscriptionsButton;
