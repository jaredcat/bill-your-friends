import { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2020-08-27",
});

type Body = {
  slug: string;
  customerId: string;
  sessionId?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { customerId, slug, sessionId }: Body = req.body;
    let returnUrl = `${req.headers.origin}/${slug}?success=true`;
    if (sessionId) returnUrl += `&session_id=${sessionId}`;
    try {
      const params: Stripe.BillingPortal.SessionCreateParams = {
        customer: customerId,
        return_url: returnUrl,
      };

      const billingPortalSession: Stripe.BillingPortal.Session =
        await stripe.billingPortal.sessions.create(params);

      res.status(200).json(billingPortalSession);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
