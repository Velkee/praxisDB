import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from './Company';

@Entity()
export class Subject {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column('text')
	name!: string;

	@ManyToMany(() => Company, (company) => company.subjects)
	@JoinTable()
	companies!: Company[];
}
