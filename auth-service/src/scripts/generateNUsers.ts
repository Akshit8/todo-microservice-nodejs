// script to generate N users in db
import { createConnection } from "typeorm";
import ormconfig from "../../ormconfig";
import { UserFactory } from "../repository";

(async () => {
  const connection = await createConnection(ormconfig);

  const userFactory = new UserFactory("testpswd");

  await userFactory.addModels(10);

  await connection.close();
})();
