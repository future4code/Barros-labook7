import { connection } from "./index"

connection
   .raw(`
      CREATE TABLE IF NOT EXISTS Labook_users(
         id VARCHAR(255) PRIMARY KEY,
         name VARCHAR(255) NOT NULL,
         email VARCHAR(255) UNIQUE NOT NULL,
         password VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Labook_posts(
         id VARCHAR(255) PRIMARY KEY,
         photo VARCHAR(255) NOT NULL,
         description VARCHAR(255) NOT NULL,
         type ENUM("normal","event") DEFAULT "normal",
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         date_post DATE NOT NULL,
         author_id VARCHAR(255),
         FOREIGN KEY (author_id) REFERENCES Labook_users(id)
      );
      
      CREATE TABLE IF NOT EXISTS Labook_friends(
         id VARCHAR(255) PRIMARY KEY,
         user_id_1 VARCHAR(255) NOT NULL,
         user_id_2 VARCHAR(255) NOT NUll,
         FOREIGN KEY(user_id_1) REFERENCES Labook_users(id),
         FOREIGN KEY(user_id_2) REFERENCES Labook_users(id)
      );
   `)
   .then(() => {
    console.log(`Tables created successfully!`)
})
.catch((error: any) => console.log(error.sqlMessage || error.message))
