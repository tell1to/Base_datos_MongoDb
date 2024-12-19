import { Schema, model } from "mongoose";

const TaskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
    description: { type: Number, trim: true },
    done: { type: Boolean, default: false },
    estado: { type: Number, default: 1 }, // 1 = Activo, 0 = Inactivo
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Task", TaskSchema);