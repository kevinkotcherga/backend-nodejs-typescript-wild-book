import express from 'express';
import cors from 'cors';
import datasource from './utils';
import wildersController from './controllers/Wilders';
import skillsController from './controllers/Skills';
import upvotesController from './controllers/Upvotes';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('Hello you!');
});

type Controller = (req: express.Request, res: express.Response) => void;
// High order function = function that returns a function
const asyncHandler = (controller: Controller): Controller => {
	return async function (req: express.Request, res: express.Response): Promise<void> {
		try {
			await controller(req, res);
		} catch (err: any) {
			console.error('Error: ', err);
			res.status(500).json({ error: err.message = 'Error occured' });
		}
	};
};

// Pur function, same input = same output
// function sum(a: number, b: number): number {
// 	return a + b;
// }


/**
 * Wilders Routes
 */
app.post('/api/wilders', wildersController.create);
app.get('/api/wilders', wildersController.findAll);
app.get('/api/wilders/:wilderId', asyncHandler(wildersController.find));
app.put('/api/wilders/:wilderId', asyncHandler(wildersController.update));
app.delete('/api/wilders/:wilderId', wildersController.delete);
// app.post('/api/wilders/:wilderId/skills', wildersController.addSkills);
// app.post(
//   "/api/wilders/:wilderId/skills",
//   asyncHandler(wildersController.addSkills)
// );

/**
 * Skills Routes
 */
app.get('/api/skills', skillsController.findAll);
app.get('/api/skills/:skillId', skillsController.find);
app.post('/api/skills', skillsController.create);
app.put('/api/skills/:skillId', skillsController.update);
app.delete('/api/skills/:skillId', skillsController.delete);

/**
 * Upvotes Routes
 */
app.post('/api/upvotes', asyncHandler(upvotesController.create));
app.put(
	'/api/upvotes/:upvoteId/upvote',
	asyncHandler(upvotesController.upvote),
);
app.put(
	'/api/upvotes/:upvoteId/negativevote',
	asyncHandler(upvotesController.negativevote),
);

app.listen(5000, async () => {
	console.log('Server started, youpi!');

	/**
	 * datasource.initialize()
	 *  .then(() => console.log("I'm connected!"))
	 *  .catch(() => console.log("Dommage"))
	 */

	try {
		await datasource.initialize();
		console.log("I'm connected!");
	} catch (err) {
		console.log('Dommage');
		console.error(err);
	}
});

// 2 bonuses
// → add upvotes to wilder skill
// → uploaded un avatar, package → multer
