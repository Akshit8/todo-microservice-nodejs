import cors from "cors";
import express from "express";
import { ServiceBroker } from "moleculer";
import { brokerConfig } from "./moleculer.config";

const gatewayBroker = new ServiceBroker(brokerConfig);

const createGatewayService = async (): Promise<void> => {
  gatewayBroker.createService({
    name: "gateway-service"
  });

  await gatewayBroker.start();
};

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test-auth", async (req, res) => {
  try {
    const response = await gatewayBroker.call("auth.test");
    res.send(response);
  } catch (e) {
    res.send(e);
  }
});

app.get("/test-todo", async (req, res) => {
  const response = await gatewayBroker.call("todo-service.test");
  res.send(response);
});

app.listen(3000, () => {
  console.log("server started");
});

createGatewayService();
