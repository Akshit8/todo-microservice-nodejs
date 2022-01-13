import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { BcryptHasher } from "../utils";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(username: string, email: string) {
    this.username = username;
    this.email = email;
  }

  @BeforeInsert()
  async hashPassword() {
    const passwordHasher = new BcryptHasher();

    this.password = await passwordHasher.hashPassword(this.password);
  }
}
