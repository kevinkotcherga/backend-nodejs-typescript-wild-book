import datasource from '../utils';
import { Request, Response } from 'express';
import { Skill } from '../entities/Skill';

export default {
	//
	// ORM create
	//
	create: (req: Request, res: Response): void => {
		const repository = datasource.getRepository(Skill);

		repository.save(req.body).then(
			() => {
				console.log('Created');
			},
			() => {
				console.log('Error');
			},
		);
		res.json({ message: 'Created' });
	},

	//
	// SQL create
	//

	// create: (req: Request, res: Response) => {
	// 	const repository = datasource.getRepository('Skill');

	// 	repository
	// 		.query('INSERT INTO skill(name) VALUES (?)', [req.body.name])
	// 		.then(
	// 			id => {
	// 				repository
	// 					.query('SELECT * FROM skill WHERE id=?', [id])
	// 					.then(data => {
	// 						res.json(data[0]);
	// 					});
	// 			},
	// 			err => {
	// 				console.error('Error: ', err);
	// 				res.json({ success: false });
	// 			},
	// 		);
	// },

	//
	// ORM findAll
	//

	findAll: async (req: Request, res: Response): Promise<void> => {
		const repository = datasource.getRepository(Skill);
		const skills = await repository.find({
			relations: ['upvote', 'upvote.wilder'],
		});
		res.json(skills);
	},

	//
	// SQL findAll
	//

	// findAll: (req: Request, res: Response) => {
	// 	const repository = datasource.getRepository('Skill');

	// 	repository.query('SELECT * FROM skill').then(data => {
	// 		res.json(data);
	// 	});
	// },

	//
	// ORM find
	//

	find: (req: Request, res: Response): void => {
		const repository = datasource.getRepository(Skill);
		const skillId = req.params.skillId;
		repository.findOneBy({ id: Number(skillId) }).then(
			data => {
				res.json(data);
			},
			err => {
				console.error('Error: ', err);
				res.json({ success: false });
			},
		);
	},

	//
	// SQL find
	//

	// find: (req: Request, res: Response) => {
	// 	const repository = datasource.getRepository('Skill');
	// 	const skillId = req.params.skillId;
	// 	repository.query('SELECT * FROM skill WHERE id=?', [skillId]).then(data => {
	// 		res.json(data);
	// 	});
	// },

	//
	// ORM update
	//

	update: async (req: Request, res: Response): Promise<void> => {
		const repository = datasource.getRepository('Skill');
		const skillId = req.params.skillId;
		const skillName = req.body.name;
		await repository.findOneByOrFail({ id: Number(skillId) });
		const updatedSkill = repository.save(skillName, { reload: true });
		res.json(updatedSkill);
	},

	//
	// SQL update
	//

	// update: (req: Request, res: Response) => {
	// 	const repository = datasource.getRepository('Skill');
	// 	const skillId = req.params.skillId;
	// 	const skillName = req.body.name;
	// 	repository
	// 		.query('UPDATE skill SET name=? WHERE id=?', [skillName, skillId])
	// 		.then(data => {
	// 			res.json(data);
	// 		});
	// },

	//
	// SQL update
	//

	delete: async (req: Request, res: Response): Promise<void> => {
		const repository = datasource.getRepository('Skill');
		const skillId = req.params.skillId;
		await repository.query('DELETE FROM skill WHERE id=?', [skillId]).then(data => {
			res.json(data);
		});
	},
};
