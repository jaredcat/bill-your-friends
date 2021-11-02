import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

import Stripe from "stripe";
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2020-08-27",
});

type Body = {
  email: string;
  slug: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const email: string = (<Body>req.body).email.trim().toLowerCase();
    const slug: string = req.body.slug;
    if (!email) {
      return res
        .status(400)
        .json({ statusCode: 400, message: "Invalid email" });
    }
    try {
      const params: Stripe.CustomerListParams = {
        limit: 100,
      };

      const customersList: Stripe.ApiList<Stripe.Customer> =
        await stripe.customers.list(params);

      let customer: Stripe.Customer;
      if (customersList?.data?.length) {
        customersList.data.every((customerListItem) => {
          if (customerListItem?.email?.trim()?.toLowerCase() === email) {
            customer = customerListItem;
            return true;
          }
          return false;
        });
      }

      if (customer?.id) {
        const returnUrl = `${req.headers.origin}/${slug}`;
        const paramsBillingPortal: Stripe.BillingPortal.SessionCreateParams = {
          customer: customer.id,
          return_url: returnUrl,
        };

        const billingPortalSession: Stripe.BillingPortal.Session =
          await stripe.billingPortal.sessions.create(paramsBillingPortal);

        console.log(billingPortalSession.url);

        const transporter = nodemailer.createTransport({
          port: Number(process.env.EMAIL_PORT),
          host: process.env.EMAIL_HOST,
          auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASSWORD,
          },
          secure: true,
        });

        const mailData = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `Subscription Magic Link`,
          text: `Manage your ${slug} subscription here: ${billingPortalSession.url}`,
          html: `Manage your ${slug} subscription here: <a href="${billingPortalSession.url}" target="blank">Click here</a>`,
        };

        const mailResponse = await transporter.sendMail(mailData);
        console.info(mailResponse);
        return res.status(200).json({ statusCode: 200, message: "Email sent" });
      }
      return res
        .status(404)
        .json({ statusCode: 404, message: "Email not found" });
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
