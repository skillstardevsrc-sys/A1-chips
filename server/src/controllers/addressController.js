import { Address } from "../models/Address.js";

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    return res.status(200).json({ success: true, data: { addresses } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { isDefault } = req.body;
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
      ...req.body,
      user: req.user._id,
    });

    return res.status(201).json({ success: true, message: "Address added", data: { address } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDefault } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.findOneAndUpdate({ _id: id, user: req.user._id }, req.body, { new: true });
    if (!address) return res.status(404).json({ success: false, message: "Address not found" });

    return res.status(200).json({ success: true, message: "Address updated", data: { address } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!address) return res.status(404).json({ success: false, message: "Address not found" });

    return res.status(200).json({ success: true, message: "Address deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
