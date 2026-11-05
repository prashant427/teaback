import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        clerkId:{ type: String, required: true, unique: true,  },
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        cartProduct: [
            {
                product: { type: String,  },
                quantity: { type: Number, default: 0 },
            },
        ],
       
    },
    { timestamps: true }
);

// In Next.js hot-reload environment, avoid OverwriteModelError by reusing existing model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;