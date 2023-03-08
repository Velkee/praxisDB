import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { Checked } from './Checked';
import { Subject } from './Subject';

@Entity()
export class Company {
	@PrimaryColumn()
	id!: number;

	@Column('text')
	name!: string;

	@ManyToOne(() => Checked, (checked) => checked.company)
	checked!: Checked;

	@ManyToMany(() => Subject, (subject) => subject.companies)
	subjects!: Subject[];
}
