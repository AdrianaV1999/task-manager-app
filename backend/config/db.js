import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://adrianav12899:taskflow128@cluster0.tclwglh.mongodb.net/Taskflow`
    );
    console.log("DB CONNECTED");
  } catch (error) {
    console.error("DB CONNECTION ERROR:", error);
  }
};
