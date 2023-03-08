import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from './Company';

@Entity()
export class Checked {
	@PrimaryGeneratedColumn()
	id!: number;

	@OneToMany(() => Company, (company) => company.checked)
	company!: Company[];

	@Column('timestamptz')
	timestamp!: string;

	@Column('boolean')
	responded!: boolean;

	@Column('boolean')
	accepted!: boolean;

	@Column({ type: 'integer', nullable: true })
	admin_id!: number | null;

	@Column('text')
	proof!: string;
}
