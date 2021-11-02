import React from "react";
import styled from "@emotion/styled";
import { NextApiResponse } from "next";
import { fetchPostJSON } from "../utils/api-helpers";

const Container = styled.div`
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  border-radius: 25px;
  max-width: 500px;
  min-width: 250px;
  min-height: 250px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.6));
`;

type Props = {
  popupIsOpen: boolean;
  setPopupIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  success: boolean;
  canceled: boolean;
  customerId: string;
  handleClickManageBilling: () => Promise<void>;
  slug: string;
};

type APIResponse = NextApiResponse & {
  message: string;
  statusCode: number;
};

const Popup = ({
  popupIsOpen = false,
  setPopupIsOpen,
  success = false,
  canceled = false,
  customerId = "",
  handleClickManageBilling,
  slug = "/",
}: Props) => {
  let header = "";
  let subtitle = "";
  let children: JSX.Element = null;

  const handleEmailLookup = async (event) => {
    event.preventDefault();
    const response: APIResponse = await fetchPostJSON(
      "/api/subscription-lookup",
      {
        email: event.target.emailLookup.value,
        slug,
      }
    );

    if (response.statusCode !== 200) {
      console.error(response.statusCode, response.message);
    } else {
      console.log(response.statusCode, response.message);
      setPopupIsOpen(false);
    }
  };

  const handleClose = () => {
    setPopupIsOpen(false);
  };

  if (!popupIsOpen) return null;
  const state = {
    SUCCESS: success && !canceled,
    SUBSCRIBER_CANCELED: canceled && !!customerId,
    CANCELLED: canceled,
    SUBSCRIBER: !!customerId,
    UNKNOWN_MANAGE: true,
  };
  if (state.SUCCESS) {
    header = "Success!";
    subtitle = "Manage Subscription";
    children = (
      <>
        {customerId ? (
          <button onClick={handleClickManageBilling}>Manage Billing</button>
        ) : null}
        <button onClick={handleClose}>Close</button>
      </>
    );
  } else if (state.SUBSCRIBER_CANCELED) {
    header = "Canceled";
    subtitle = "Your subscription was not changed";
    children = (
      <>
        <button onClick={handleClickManageBilling}>Manage Billing</button>
        <button onClick={handleClose}>Close</button>
      </>
    );
  } else if (state.CANCELLED) {
    header = "Canceled";
    subtitle = "Your card was not charged";
    children = <button onClick={handleClose}>Close</button>;
  } else if (state.SUBSCRIBER) {
    header = "Already a subscriber";
    subtitle = "You're currently a subscriber would you like to: ";
    children = (
      <>
        <button onClick={handleClickManageBilling}>Manage subscription</button>
        <button onClick={handleClose}>Add another subscription</button>
        <br />
        <button onClick={handleClose}>Close</button>
      </>
    );
  } else if (state.UNKNOWN_MANAGE) {
    header = "Look up your subscription";
    subtitle = "Type your email that you used to subscribe: ";
    children = (
      <>
        <form onSubmit={handleEmailLookup}>
          <label htmlFor="emailLookup">Email: </label>
          <input
            id="emailLookup"
            name="emailLookup"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            required
          ></input>
          <button type="submit">Submit</button>
        </form>
        <button onClick={handleClose}>Add another subscription</button>
        <br />
        <button onClick={handleClose}>Close</button>
      </>
    );
  }

  return (
    <Container>
      <h2>{header}</h2>
      <h3>{subtitle}</h3>
      {children}
    </Container>
  );
};

export default Popup;
