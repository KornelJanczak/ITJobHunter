import { Application } from "express";
import createApp from "./app";

const PORT = process.env.PORT || 3000;
const app: Application = createApp();

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
