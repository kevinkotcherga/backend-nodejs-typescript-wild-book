import datasource from '../utils';
import { Request, Response } from 'express';
import { Wilder } from '../entities/Wilder';

export default {
	//
	// SQL create
	//

	// create: (req: Request, res: Response) => {
	// 	const repository = datasource.getRepository('Wilder');

	// 	repository
	// 		.query('INSERT INTO wilder(name) VALUES (?)', [req.body.name])
	// 		.then(
	// 			id => {
	// 				repository
	// 					.query('SELECT * FROM wilder WHERE id=?', [id])
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
	// ORM create
	//

	create: (req: Request, res: Response): void => {
		const repository = datasource.getRepository(Wilder);
		repository.save(req.body).then(
			() => {
				console.log('Created');
			},
			() => {
				console.error('Error');
			},
		);
		res.json({ message: 'Create' });
	},

	//
	// SQL findAll
	//

	// findAll: (req: Request, res: Response) => {
	// 	const repository = datasource.getRepository('Wilder');

	// 	repository.query('SELECT * FROM wilder').then(
	// 		data => {
	// 			res.json(data);
	// 		},
	// 		err => {
	// 			console.error('Error: ', err);
	// 			res.json({ success: false });
	// 		},
	// 	);
	// },

	//
	// ORM findAll
	//

	findAll: (req: Request, res: Response): void => {
    const repository = datasource.getRepository(Wilder);

    repository.find({ relations: ["upvote", "upvote.skill"] }).then(
      (data) => {
        res.json(data);
      },
      (err) => console.error(err)
    );
  },

	// findAll: (req: Request, res: Response): void => {
	// 	const repository = datasource.getRepository(Wilder);

	// 	repository.find({ relations: ['upvotes', 'upvotes.skill'] }).then(data => {
	// 		res.json(data);
	// 	});
	// },

	//
	// SQL find
	//

	// find: (req: Request, res: Response) => {
	// 	const repository = datasource.getRepository('Wilder');
	// 	const wilderId = req.params.wilderId;

	// 	repository.query('SELECT * FROM wilder WHERE id=?', [wilderId]).then(
	// 		data => {
	// 			res.json(data);
	// 		},
	// 		err => {
	// 			console.error('Error: ', err);
	// 			res.json({ success: false });
	// 		},
	// 	);
	// },

	//
	// ORM find
	//

	find: async (req: Request, res: Response): Promise<void> => {
		const wilderId = req.params.wilderId;

		// find 1 wilder by its ID
		await datasource
			.getRepository(Wilder)
			.findOneBy({ id: Number(wilderId) })
			.then(
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
	// SQL update
	//

	// update: (req: Request, res: Response) => {
	// 	const repository = datasource.getRepository('Wilder');
	// 	const wilderId = req.params.wilderId;
	// 	const wilderName = req.body.name;
	// 	repository
	// 		.query('UPDATE wilder SET name=? WHERE id=?', [wilderName, wilderId])
	// 		.then(
	// 			data => {
	// 				res.json(data);
	// 			},
	// 			err => {
	// 				console.error('Error: ', err);
	// 				res.json({ success: false });
	// 			},
	// 		);
	// },

	//
	// ORM update
	//

	update: async (req: Request, res: Response): Promise<void> => {
		const wilderId = req.params.wilderId;
		const repository = datasource.getRepository(Wilder);

		const wilder = await repository.findOneByOrFail({ id: Number(wilderId) });

		wilder.name = req.body.name;
    wilder.city = req.body.city;

		const updatedWilder = await repository.save(wilder, { reload: true });
		res.json(updatedWilder);
	},

	//
	// SQL delete
	//

	// delete: (req: Request, res: Response): void => {
	// 	const wilderId = req.params.wilderId;
	// 	const repository = datasource.getRepository(Wilder);

	// 	repository.query('DELETE FROM wilder WHERE id=?', [wilderId]).then(
	// 		() => {
	// 			res.json({ success: true });
	// 		},
	// 		err => {
	// 			console.error('Error when removing: ', err);
	// 			res.json({ success: false });
	// 		},
	// 	);
	// },

  //
  // ORM DELETE
  //
  delete: async (req: Request, res: Response) => {
    const repository = datasource.getRepository(Wilder);
    try {
      // Middleware de vérification des params
      if (typeof Number(req.params.wilderId) !== "number") {
        throw new Error("Ther's not a wilderId Params valide");
      }
      const oneWilder = await repository.findOneByOrFail({
        id: Number(req.params.wilderId),
      });
      console.log("Wilder found");
      try {
        await repository.remove(oneWilder);
        console.log("Wilder removed");
        res.status(201).json({ succes: true });
      } catch (error) {
        console.error(error);
        res.json({ succes: false, message: "Error wilder not removed" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(404)
        .json({ succes: false, message: "Error wilder not found" });
    }
  },

	// addSkill: (req: Request, res: Response): void => {
	// 	const wilderId = req.params.wilderId;
	// 	const skillId = req.body.skillId;
	// 	const manager = datasource.manager;

	// 	manager
	// 		.query(
	// 			'INSERT INTO wilder_skills_skill(wilderId, skillId) VALUES (?, ?)',
	// 			[wilderId, skillId],
	// 		)
	// 		.then(
	// 			id => {
	// 				manager
	// 					.query(
	// 						`
  //             SELECT wilder.id AS wilderId, wilder.name AS wilderName, skill.id AS skillId, skill.name AS skillName
  //             FROM wilder
  //             LEFT JOIN wilder_skills_skill AS wss ON wss.wilderId = wilder.id
  //             LEFT JOIN skill ON skill.id = wss.skillId
  //             WHERE wilder.id=?
  //           `,
	// 						[wilderId],
	// 					)
	// 					.then(rows => {
	// 						// because of the left join, we got as many rows as the wilder has skills
	// 						// we need to flatten them
	// 						const wilder = {
	// 							id: rows[0].wilderId,
	// 							name: rows[0].wilderName,
	// 							skills: rows // 1st remove all rows not related to skills, then map them to recreate skill entities
	// 								.filter(
	// 									(row: any) => row.skillId !== null && row.skillId !== undefined,
	// 								)
	// 								.map((row: any) => ({ id: row.skillId, name: row.skillName })),
	// 						};
	// 						res.json(wilder);
	// 					});
	// 			},
	// 			err => {
	// 				console.error('Error: ', err);
	// 				res.json({ success: false });
	// 			},
	// 		);

		/*
    datasource
      .getRepository("Wilder")
      .findOneByOrFail({ id: wilderId })
      .then((wilderToUpdate) => {
        datasource
          .getRepository("Skill")
          .findOneByOrFail({ id: skillId })
          .then((skillToInsert) => {
            wilderToUpdate.skills.push(skillToInsert);
            datasource
              .getRepository("Wilder")
              .save(wilderToUpdate)
              .then(
                (updatedWilder) => {
                  res.json(updatedWilder);
                },
                (err) => {
                  console.error("Error when saving: ", err);
                  res.json({ success: false });
                }
              );
          });
      }); */
// 	addSkills: async (req: Request, res: Response): Promise<void> => {
// 		const wilderId = req.params.wilderId;
// 		const skillsIds = req.body.skillsIds;
// 		const repository = datasource.getRepository(Wilder);

// 		const wilder = await repository.findOneByOrFail({ id: Number(wilderId) });
// 		const skill = await datasource
// 			.getRepository(Skill)
// 			.find({ where: { id: skillsIds }});

// 		wilder.skill = skill;

// 		const updatedWilder = await repository.save(wilder);
// 		res.json(updatedWilder);
// 	},
};
