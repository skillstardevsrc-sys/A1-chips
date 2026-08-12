import { SiteSetting } from "../models/SiteSetting.js";
import { NewsletterSubscriber, ContactMessage } from "../models/MiscModels.js";

export const getSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({});
    }
    return res.status(200).json({ success: true, data: { settings } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = new SiteSetting(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    return res.status(200).json({ success: true, message: "Site settings updated", data: { settings } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(200).json({ success: true, message: "You are already subscribed to A1 Chips newsletter!" });
    }

    await NewsletterSubscriber.create({ email: email.toLowerCase() });
    return res.status(201).json({ success: true, message: "Thank you for subscribing to A1 Chips!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email, and message are required" });
    }

    const contactMsg = await ContactMessage.create({ name, email, phone, subject, message });
    return res.status(201).json({
      success: true,
      message: "Your message has been received! Our support team will get back to you shortly.",
      data: { contactMsg },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
