import mongoose, { Schema, Document } from 'mongoose';


export interface INote extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}


const NoteSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true } 
);


export default mongoose.model<INote>('Note', NoteSchema);