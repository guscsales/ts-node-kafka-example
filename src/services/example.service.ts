import Kafka from 'kafka-node';
import Avro from '@avro/types';

const schema: any = {
	type: 'record',
	name: 'NerdzaoExample',
	namespace: 'nerdzao.event',
	fields: [
		{
			name: 'id',
			type: 'string'
		},
		{
			name: 'name',
			type: {
				type: 'string'
			}
		},
		{
			name: 'role',
			type: {
				type: 'enum',
				name: 'RoleEnum',
				symbols: ['ADMIN', 'USER', 'GUEST']
			}
		}
	]
};

class ExampleService {
	public static startConsumer(): void {
		const { KAFKA_HOST, KAFKA_GROUP_ID, KAFKA_TOPIC } = process.env;
		const consumer = new Kafka.ConsumerGroup(
			{
				kafkaHost: KAFKA_HOST,
				groupId: KAFKA_GROUP_ID,
				autoCommit: true,
				fromOffset: 'latest',
				encoding: 'buffer'
			},
			[KAFKA_TOPIC]
		);
		const type = Avro.Type.forSchema(schema);

		consumer.on('message', ({ value }: { value: any }) => {
			const message = type.fromBuffer(value);

			console.log('MENSAGEM CONSUMIDA EM BUFFER =>', value);
			console.log(
				'MENSAGEM CONSUMIDA EM JSON =>',
				JSON.stringify(message, null, 2)
			);
		});
	}

	public static produceMessage(data: any): void {
		const { KAFKA_HOST, KAFKA_TOPIC } = process.env;
		const client = new Kafka.KafkaClient({ kafkaHost: KAFKA_HOST });
		const producer = new Kafka.Producer(client);
		const type = Avro.Type.forSchema(schema);
		const messages = type.toBuffer(data);

		producer.send([{ topic: KAFKA_TOPIC, messages }], e => {
			if (e) {
				console.error(e);
			} else {
				console.log('REGISTRO PRODUZIDO');
			}
		});
	}
}

export default ExampleService;
