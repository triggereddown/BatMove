const mongoose = require('mongoose');
require('dotenv').config();

const uri = "mongodb://deepmoitra1_db_user:VgJuUW0JXHhvnllm@ac-lua4pfi-shard-00-00.ibmojbb.mongodb.net:27017/batmove?ssl=true&authSource=admin";

console.log('Connecting to:', uri.replace(/:[^@]*@/, ':****@'));

mongoose.connect(uri)
  .then(async (conn) => {
    console.log('✅ Connection Successful!');
    const hello = await conn.connection.db.admin().command({ hello: 1 });
    console.log('Replica Set Name:', hello.setName);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection Error:', err.message);
    process.exit(1);
  });
