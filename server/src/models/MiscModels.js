import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["ORDER", "SYSTEM", "PROMO"], default: "ORDER" },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: "" },
  },
  { timestamps: true }
);

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, enum: ["NEW", "IN_PROGRESS", "RESOLVED"], default: "NEW" },
  },
  { timestamps: true }
);

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, enum: ["SUBSCRIBED", "UNSUBSCRIBED"], default: "SUBSCRIBED" },
    source: { type: String, default: "WEBSITE" },
  },
  { timestamps: true }
);

const auditLogSchema = new mongoose.Schema(
  {
    adminEmail: { type: String, required: true },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String, default: "" },
    details: { type: Object, default: {} },
    ip: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
export const NewsletterSubscriber = mongoose.model("NewsletterSubscriber", newsletterSubscriberSchema);
export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
