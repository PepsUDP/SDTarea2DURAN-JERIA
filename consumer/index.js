const express = require("express");
const cors = require("cors");
const { Kafka } = require('kafkajs')
const nodemailer = require('nodemailer');

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

const kafka = new Kafka({
  brokers: [process.env.kafkaHost]
});

app.get("/", async (req, res) => {
  res.send("Hello World! Consumer");
});

app.listen(port, () => {
  console.log(`API RUN AT http://localhost:${port}`);
});

// the client ID lets kafka know who's producing the messages
const clientId = "consumer"
// we can define the list of brokers in the cluster
const brokers = ["0.0.0.0:9092"]
// this is the topic to which we want to write messages
const topic = "pedidos"


const consumer = kafka.consumer({ groupId: clientId });
const producer = kafka.producer();

// Nodemailer configuration
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'ignaciomunozj1@gmail.com',
		pass: 'tnrg sipp voxk ydmi'
	}
});

const sendEmail = (email, subject, text) => {
	const mailOptions = {
		from: 'ignaciomunozj1@gmail.com',
		to: email,
		subject: subject,
		text: text
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log('Email sent: ' + info.response);
	});
};

const sendMessage = async (key, value) => {
	await producer.connect();
	await producer.send({
		topic,
		messages: [
			{ key, value: JSON.stringify(value) }
		]
	});
	console.log(`Message sent to Kafka topic: ${topic}`);
};

const processedMessages = new Set();

// Function to consume messages
const consume = async () => {
	// Client subscribes to topic
	await consumer.connect();
	await producer.connect();
	await consumer.subscribe({ topic });
	await consumer.run({
		eachMessage: ({ message }) => {
			const key = message.key.toString();
			let value = message.value.toString();
			console.log(`ID: ${key} - Value: ${value}`);
			value = JSON.parse(value);

			const estados = ["recibido", "preparando", "entregando", "finalizado"];
			let estadoIndex = estados.indexOf(value.estado);

			if (estadoIndex === -1) {
				estadoIndex = 0;
			} else {
				estadoIndex++;
			}
			
			if (estadoIndex >= estados.length) {
				return;
			}

			const updateEstado = async () => {
				if (estadoIndex < estados.length) {
				  value.estado = estados[estadoIndex];
				  console.log(`Pedido n° ${key}: ${JSON.stringify(value)}`);

				  const subject = `Su pedido se encuentra en estado: ${value.estado}`;
				  const text = `El estado de su pedido ha sido actualizado a: ${value.estado}`;
				  sendEmail(value.email, subject, text);

				  // console.log(key, value);
				  await sendMessage(key, value);

				  processedMessages.add(key + value.estado);

				  estadoIndex++;
				  if (estadoIndex < estados.length) {
					setTimeout(updateEstado, 5000);
				  }
				}
			  };

			  if (!processedMessages.has(key + estados[estadoIndex - 1])) {
				processedMessages.add(key + estados[estadoIndex - 1]);
			    updateEstado();
			  }
		}
	});
}

// Lee los mensajes en topic
app.get("/cons", async (req, res) => {
  consume();
  res.send("Consuming");
});
