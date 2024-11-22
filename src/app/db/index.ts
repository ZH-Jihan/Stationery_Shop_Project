import mongoose from 'mongoose';
import config from '../config/index';

const dbConnection = async () => {
  try {
    const conactionRespons = await mongoose.connect(
      `${config.database_url}/${config.database_name}`,
    );
    console.log(
      `MongoDB Conacted host: ${conactionRespons.connections[0].host}`,
    );
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default dbConnection;
