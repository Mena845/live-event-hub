import express from "express";
import cors from "cors";

import eventRoutes    from "./routes/events.js";
import sessionRoutes  from "./routes/sessions.js";
import speakerRoutes  from "./routes/speakers.js";
import roomRoutes     from "./routes/rooms.js";
import questionRoutes from "./routes/questions.js";
import favoriteRoutes from "./routes/favorites.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/events",    eventRoutes);
app.use("/api/sessions",  sessionRoutes);
app.use("/api/speakers",  speakerRoutes);
app.use("/api/rooms",     roomRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/favorites", favoriteRoutes);

app.get("/", (req, res) => res.send("EventFlow API is running."));

app.listen(port, () => {
  console.log(`EventFlow backend running on http://localhost:${port}`);
});
