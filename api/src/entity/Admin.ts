import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Session } from './Session';

@Entity()
export class Admin {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	username!: string;

	@Column('text')
	passwordhash!: string;

	@OneToOne(() => Session, (session) => session.admin)
	@JoinColumn()
	session!: Session;
}
