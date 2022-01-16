import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  owner: number;

  @Column()
  action_item: string;

  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(action_item?: string, owner?: number) {
    this.action_item = action_item!;
    this.owner = owner!;
  }
}
