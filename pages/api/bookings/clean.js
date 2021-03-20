import { Booking } from "../../../model.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end(); //Method Not Allowed
    return;
  }

  Booking.destroy({
    where: {
      paid: false,
    },
  });

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(
    JSON.stringify({
      status: "success",
      message: "ok",
    })
  );
};
