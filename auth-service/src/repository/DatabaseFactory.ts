// import faker from "faker";
import { Repository } from "typeorm";

// eslint-disable-next-line no-unused-vars
interface Entity<T> {
  getModel(): T;
}

export class DatabaseFactory<T, K extends Repository<T>> {
  models: T[];
  repo: K;

  constructor(repo: K) {
    this.repo = repo;
  }

  async addModels(n: number) {
    await this.repo.save(this.models);
  }

  async deleteModels() {
    await this.repo.remove(this.models);
  }
}
