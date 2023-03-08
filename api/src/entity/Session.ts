import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Admin } from './Admin';

@Entity()
export class Session {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column('text')
	key!: string;

	@OneToOne(() => Admin, (admin) => admin.session)
	admin!: Admin;
}
