import { Request, Response } from "express";
import { SavedFund } from "../models/SavedFund";

// Get all saved funds for a user
export const getSavedFunds = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId)
    return res.status(401).json({ message: "User not authenticated" });

  try {
    const savedFunds = await SavedFund.find({ userId }).sort({ savedAt: -1 });
    return res.json({
      success: true,
      data: savedFunds,
      count: savedFunds.length,
    });
  } catch (error) {
    console.error("Get saved funds error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch saved funds",
    });
  }
};

// Save a new fund
export const saveFund = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { schemeCode, schemeName, currentNav } = req.body;

    console.log("Backend: Received request body:", req.body);
    console.log("Backend: schemeCode:", schemeCode);
    console.log("Backend: schemeName:", schemeName);
    console.log("Backend: userId:", userId);

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!schemeCode || !schemeName) {
      console.log(
        "Backend: Missing required fields - schemeCode:",
        schemeCode,
        "schemeName:",
        schemeName
      );
      res.status(400).json({
        success: false,
        message: "Scheme code and scheme name are required",
      });
      return;
    }

    const alreadySaved = await SavedFund.findOne({ userId, schemeCode });
    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: "Fund is already saved",
      });
    }

    const savedFund = await SavedFund.create({
      userId,
      schemeCode,
      schemeName,
      currentNav,
      savedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Fund saved successfully",
      data: savedFund,
    });
  } catch (error: any) {
    console.error("Save fund error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save fund",
    });
  }
};

// Remove a saved fund
export const removeFund = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { schemeCode } = req.params;

  if (!userId)
    return res.status(401).json({ message: "User not authenticated" });

  if (!schemeCode) {
    return res.status(400).json({
      success: false,
      message: "Scheme code is required",
    });
  }

  try {
    const deleted = await SavedFund.findOneAndDelete({ userId, schemeCode });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Saved fund not found",
      });
    }

    return res.json({
      success: true,
      message: "Fund removed successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Remove fund error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove fund",
    });
  }
};

// Check if a fund is saved
export const isFundSaved = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { schemeCode } = req.params;

  if (!userId)
    return res.status(401).json({ message: "User not authenticated" });

  if (!schemeCode) {
    return res.status(400).json({
      success: false,
      message: "Scheme code is required",
    });
  }

  try {
    const savedFund = await SavedFund.findOne({ userId, schemeCode });
    return res.json({
      success: true,
      isSaved: !!savedFund,
      data: savedFund || null,
    });
  } catch (error) {
    console.error("Check fund saved error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check fund status",
    });
  }
};

// Update NAV
export const updateFundNav = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { schemeCode } = req.params;
  const { currentNav } = req.body;

  if (!userId)
    return res.status(401).json({ message: "User not authenticated" });

  if (!schemeCode || !currentNav) {
    return res.status(400).json({
      success: false,
      message: "Scheme code and current NAV are required",
    });
  }

  try {
    const updated = await SavedFund.findOneAndUpdate(
      { userId, schemeCode },
      { currentNav, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Saved fund not found",
      });
    }

    return res.json({
      success: true,
      message: "Fund NAV updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update fund NAV error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update fund NAV",
    });
  }
};
