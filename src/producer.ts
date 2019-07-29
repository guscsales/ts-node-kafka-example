require('dotenv').config();

import uuid from 'uuid/v1';
import faker from 'faker';
import ExampleService from './services/example.service';

setInterval(() => {
	const data = {
		id: uuid(),
		name: `${faker.name.firstName()} ${faker.name.lastName()}`,
		role: 'ADMIN'
	};
	console.log(`PRODUZINDO NOVO REGISTRO: ${JSON.stringify(data, null, 2)}`);

	ExampleService.produceMessage(data);
}, 500);
