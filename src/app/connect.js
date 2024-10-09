import React from "react";
import { connect } from "../dbConnect/dbConnect";

export default async function App() {
  const conn = await connect();
  console.log(conn);

  return <></>;
}
