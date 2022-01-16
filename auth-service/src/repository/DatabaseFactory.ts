import { Repository } from "typeorm";

export abstract class DatabaseFactory<T, K extends Repository<T>> {
  models: T[];
  repo: K;

  constructor(repo: K) {
    this.repo = repo;
  }

  abstract getModel(): Promise<T>;

  async addModels(n: number) {
    for (let i = 0; i < n; i++) {
      const model = await this.getModel();
      this.models.push(model);
    }
    await this.repo.save(this.models);
  }

  async deleteModels() {
    await this.repo.remove(this.models);
  }
}
