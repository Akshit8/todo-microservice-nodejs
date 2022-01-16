import { createConnection } from "typeorm";
import ormconfig from "../../ormconfig";
import { UserFactory, UserRepository } from "../repository";

(async () => {
  const connection = await createConnection(ormconfig);

  const userFactory = new UserFactory(
    connection.getCustomRepository(UserRepository),
    "testpswd"
  );

  await userFactory.addModels(10);
})();
