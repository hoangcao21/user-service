import { BaseEntity } from 'src/shared/database/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', nullable: false })
  userName: string;

  @Column({ type: 'varchar', nullable: false })
  hashedPassword: string;
}
