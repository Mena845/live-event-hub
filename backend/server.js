import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("EventFlow API is running.");
});

app.listen(port, () => {
  console.log(`EventFlow backend running on http://localhost:${port}`);
});
