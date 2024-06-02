const express = require("express");
const cors = require("cors");
const pool = require("./db");
const { Kafka } = require('kafkajs')

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

const kafka = new Kafka({
  brokers: [process.env.kafkaHost]
});

const producer = kafka.producer();

app.get("/", async (req, res) => {
    res.send("Hello World! Producer");
});

app.listen(port, () => {
  console.log(`API RUN AT http://localhost:${port}`);
});


// the client ID lets kafka know who's producing the messages
const clientId = "producer"
// we can define the list of brokers in the cluster
const brokers = ["0.0.0.0:9092"]
// Declaracion del topic
const topic = "pedidos"

let i = 1
const produce = async (req) => {

	const { food, email } = req.body;
	const price = req.price;

	await producer.connect();

	console.log('food: ' + food + ' - price: ' + price + ' - email: ' + email);
	
	try {
	  id = i.toString()
	  // Agregar email y precio al mensaje
	  await producer.send({
		topic,
		messages: [
		  {
			key: id,
			value: JSON.stringify({ food, price, email }),
		  },
		],
	  })
	  i++
	} catch (error) {
	  console.error(`Failed to send message: ${error}`)
	}
}
  

app.get("/index", async (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.post('/pedido', async (req, res) => {
	const { food, email } = req.body;

	try {
		// Query to get the price of the product
        const result = await pool.query("SELECT price FROM productos WHERE name = $1", [food]);
        const getPrice = result.rows[0]?.price; // Extract the price from the query result
        
		if (getPrice == undefined) {
			res.status(404).send('Product not found');
			return;
		}

        console.log('PRECIO: ' + getPrice);

        // Add the price to the request object
		req.price = getPrice;

        // Produce the message with the updated request
        await produce(req);

        // Send the response back to the client
        await res.send('food: ' + food + ' - email: ' + email + ' - price: ' + getPrice);

	} catch(error) {
        console.error('Error querying the database:', error);
        res.status(500).send('Internal Server Error');
	}
});