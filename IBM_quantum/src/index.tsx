import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: "https://migeliusiv.github.io",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.listen(8080, () => {
  console.log("Backend running on 8080");
});
