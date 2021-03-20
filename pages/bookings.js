import { useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import Cookies from "cookies";
import { useStoreActions } from "easy-peasy";
import { Booking, House, User } from "../model.js";
import Layout from "../components/Layout";

export default function Bookings({ bookings, houses, nextbnb_session }) {
  const setLoggedIn = useStoreActions((actions) => actions.login.setLoggedIn);

  useEffect(() => {
    if (nextbnb_session) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <Layout
      content={
        <div>
          <Head>
            <title>Your bookings</title>
          </Head>
          <h2>Your bookings</h2>

          <div className="bookings">
            {bookings.map((booking, index) => {
              const house = houses.filter(
                (house) => house.id === booking.houseId
              )[0];
              return (
                <Link href="/houses/[id]" as={"/houses/" + house.id}>
                  <a className="booking" key={index}>
                    <img src={`/img/${house.picture}`} alt="House picture" />
                    <div>
                      <h2>
                        {house.title} in {house.town}
                      </h2>
                      <p>
                        Booked from {new Date(booking.startDate).toDateString()}{" "}
                        to {new Date(booking.endDate).toDateString()}
                      </p>
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>

          <style jsx>{`
            .bookings {
              display: grid;
              grid-template-columns: 100%;
              grid-gap: 40px;
            }
            .booking {
              display: grid;
              grid-template-columns: 30% 70%;
              grid-gap: 40px;
            }
            .booking:hover {
              background: lightgray;
            }
            .booking img {
              width: 180px;
            }
          `}</style>
        </div>
      }
    />
  );
}

export async function getServerSideProps({ req, res, query }) {
  const cookies = new Cookies(req, res);
  const nextbnb_session = cookies.get("nextbnb_session");

  let bookings;
  if (!nextbnb_session) {
    res.writeHead(301, {
      Location: "/",
    });
    res.end();
    return { props: {} };
  }

  const user = await User.findOne({
    where: { session_token: nextbnb_session },
  });

  bookings = await Booking.findAndCountAll({ where: { userId: user.id } });

  const houses = await House.findAndCountAll();

  return {
    props: {
      bookings: bookings
        ? bookings.rows.map((booking) => {
            booking.dataValues.createdAt = "" + booking.dataValues.createdAt;
            booking.dataValues.updatedAt = booking.dataValues.updatedAt + "";
            return booking.dataValues;
          })
        : null,
      houses: houses.rows.map((house) => house.dataValues),
      nextbnb_session: nextbnb_session || null,
    },
  };
}
