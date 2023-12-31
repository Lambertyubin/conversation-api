# conversation-api

## 1. Brief description

This API exposes three endpoints:

- `/conversation-import/csv`: to upload a csv file to an AWS S3 bucket
- `/conversation/`: to get the list of conversations
- `/conversation/<id>/chat`: to get the list of messages in a given conversation, the <id> being the id of the conversation.
- `/conversation-import/predefined-responses`: additional endpoint to upload predefined responses.

## 2. Solution Architecture

### 2.1. Technologies/languages

I used the following technologies to build this API

- **TypeScript** as programming language
- **NodeJS** as runtime
- **Express** framework to build the API
- **AWS S3** to store csv files
- **AWS SQS** as pub/sub queue for asynchronous communication between the csv upload flow and the processing of conversation data processing.
- **PostgreSQL** as database management system to store the processed conversation data
- **Prisma** as ORM for easy data manipulation

### 2.2 Database schema

Here's the schema that represents our database tables.

- N/B: this is only be visible on github, not on gitfront

![db-schema drawio](https://github.com/Lambertyubin/conversation-api/assets/51297126/86ff7a15-9230-4e8f-8d08-8e93560345fa)

**Description:**

- A Conversation is what links a sender and receiver. A conversation can have none or many Messages. Though the Message schema has the message and response, I named it as “Message” just to stay consistent with the domain knowledge expectation that a conversation consists of multiple messages. I’m open to discussing this assumption and other options. Hence there’s a one-to-many relation between a Conversation and a Message.

- The PredefinedResponse is the table that stores predefined responses for messages. It’s more of an inference table that keeps the match between entities and responses. Entities are more of intents detected from messages.

### 2.2 System flow diagram for file upload and processing

#### N/B: this is only be visible on github, not on gitfront

![flow-diagramo](https://github.com/Lambertyubin/conversation-api/assets/51297126/f635c6b5-35e8-4693-9a64-2fde2e5c037a)

**Description:**

- **A**: The file upload service consists of a a validation middleware and a controller to validate the format and content of the csv file before sending to S3 for storage.
- **B**: AWS S3 stores the csv file in the specified bucket
- **C**: SQS receives and adds the fileKey of the uploaded file in the queue to which the aggregation service already subscribed during application startup. SQS notifies the Consumer service in the api service.
- **D**: the aggregation service coordinates with other internal services to:
- -> Identify the entity in each message
- -> Infer the response and replace {{sender_username}} and {{receiver_username}} placeholders with the right values
- -> Store conversations in database
- -> Store message and responses in database
- -> Send request to delete the fileKey from the queue

### 2.2 System flow diagram for fetching conversations and messages

Each endpoint has the following:

- **Route:** which specifies the endpoint path
- **Authentication middleware:** to control access. For now we're not enforcing the authentication.
- **Pagination and validation middleware:** to handle pagination parameters and validate request inputs.
- **Controller:** responsible for handling the request-response cycle by collecting inputs from the request and forwarding to the service layer, then receiving the response data from the service layer and forwarding to the requestor.
- **Service:** responsible for the logic needed to interpret request inputs and provide a response. It forwards inputs to the Data Access Object (Dao) for database operations (queries or commands).
- **Dao:** responsible for database operations through the entities. In this API service it uses the `PrismaClient` to talk to our Postgres database.

## 3. Improvements

This design is not void of flaws, and deserves some improvements. I focused more on the essentials of the challenge due to time constraints. Some of the limitations are:

- **Reducing the number of database calls:** for each entry in the csv file, we're making two calls to the database. This is very inefficient and should be improved to drastically reduce the number of database calls.
- **Use default pagination:** as part of existing best practices
- **Processing csv file in memory:** a more scalable improvement would be to use streams and process the data in batches. This wasn't an issue at the moment since our file is small (1000 records of text content).
- **Test coverage:** it is absolutety necessary to write at least unit and integration tests. I wrote unit tests for some services and would have done more and written integration test for endpoints if not because of time constraints. Adding more tests would increase the guarantee that we can add more features without breaking existing ones.
- **Deleting objects from S3 bucket:** this would depend on the regulation on how long we should keep the files. It seems like we'll hardly reuse them hence they could be deleted programmatically after processing and storing the data in the database.

## 4. How to install and run this api service

### 4.1. Setup and Usage

- **Step 1**: clone the repo to the local machine
- **Step 2**: install dependencies -> `npm install`
- **Step 3**: Create a `.env` file in the project root folder and copy the environment variables from `.envs.text` file into it, and provide values for your AWS credentials.
- **Step 4**: Run a database migration -> `npx prisma migrate dev` on your terminal. This would create the database client. Before doing this, ensure your postgres db instance is up and running.
- **Step 5**: Run unit tests -> `npm run test`
- **Step 6**: Start the app locally -> `npm run dev`
- **Step 7**: Load predefined responses to the database by sending the following request:
- - **Endpoint**: `/conversation-import/predefined-responses`
- - **Method**: POST
- - **Body (example)**:
- - ```{
        "data": [
            {
                "channel": "email",
                "entity": "who are you?",
                "response": "Hi {{sender_username}} my name is {{receiver_username}}"
            },
            {
                "channel": "instagram",
                "entity": "order status",
                "response": "hey this is the status of your order"
            },
            {
                "channel": "instagram",
                "entity": "how are you",
                "response": "I'm fine {{sender_username}} thanks"
            },
              {
                "channel": "facebook",
                "entity": "I need some help",
                "response": "Hello {{sender_username}} how may I help you"
            }
        ]
    }
    ```

### 4.2. Usage

- **Step 8**: Uploading a csv file
- - Endpoint: `/conversation-import/csv`
- - Method: POST
- - Body: should be a file in `form-data` category if you're using Postman
- - example file:
    [sample_correct.csv](https://github.com/Lambertyubin/e-Learning-platform-frontend/files/12873996/sample_correct.csv)

- **Step 9**: Fetch Conversations by sending a GET request to the endpoint `/conversation/` to see the list of all conversations. This endpoint supports pagination and you can use it by providing `page` and `pageSize` query parameters. For example: `/conversation?page=1&pageSize=5`.

- **Step 10**: Fetch messages per conversation by sending a GET request to the endpoint `/conversation/<id>/chat`. Here you replace `<id>` with the id of the conversation whose messages you want to query. You should get this id from the query in step 8 above. This endpoint also supports the same pagination params described in step 8.
