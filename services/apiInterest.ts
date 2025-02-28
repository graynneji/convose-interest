import axios from "axios";

export const apiInterest = axios.create({
  baseURL: "https:be-v2.convose.com",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Jy8RZCXvvc6pZQUu2QZ2",
    // Authorization: `${process.env.API_URL}`,
    Connection: "keep-alive",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en-GB,en;q=0.9,en-US;q=0.8,de-DE;q=0.7,de;q=0.6",
  },
});
