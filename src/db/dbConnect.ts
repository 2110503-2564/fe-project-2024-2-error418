import mongoose from "mongoose";
declare global {
  // eslint-disable-next-line no-var
  var instance: { connection?: typeof mongoose; promise?: Promise<typeof mongoose> }; // This must be a `var` and not a `let / const`
}

let cached = global.instance;

if (!cached) {
  cached = global.instance = { connection: undefined, promise: undefined };
}

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI!;

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  if (cached.connection) {
    return cached.connection;
  }
  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
  }
  try {
    cached.connection = await cached.promise;
  } catch (err) {
    cached.promise = undefined;
    throw err;
  }

  return cached.connection;
}

export default dbConnect;
