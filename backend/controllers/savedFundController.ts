import { Request, Response } from "express";
import { SavedFund } from "../models/SavedFund";

// Get all saved funds for a user
export const getSavedFunds = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const savedFunds = await SavedFund.find({ userId }).sort({ savedAt: -1 }); // Most recent first

    res.json({
      success: true,
      data: savedFunds,
      count: savedFunds.length,
    });
  } catch (error) {
    console.error("Get saved funds error:", error);
    res.status(500).json({
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

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!schemeCode || !schemeName) {
      res.status(400).json({
        success: false,
        message: "Scheme code and scheme name are required",
      });
      return;
    }

    // Check if fund is already saved by this user
    const existingFund = await SavedFund.findOne({
      userId,
      schemeCode,
    });

    if (existingFund) {
      res.status(400).json({
        success: false,
        message: "Fund is already saved",
      });
      return;
    }

    // Create new saved fund
    const savedFund = new SavedFund({
      userId,
      schemeCode,
      schemeName,
      currentNav,
      savedAt: new Date(),
    });

    await savedFund.save();

    res.status(201).json({
      success: true,
      message: "Fund saved successfully",
      data: savedFund,
    });
  } catch (error: any) {
    console.error("Save fund error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: "Fund is already saved",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to save fund",
    });
  }
};

// Remove a saved fund
export const removeFund = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { schemeCode } = req.params;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!schemeCode) {
      res.status(400).json({
        success: false,
        message: "Scheme code is required",
      });
      return;
    }

    const deletedFund = await SavedFund.findOneAndDelete({
      userId,
      schemeCode,
    });

    if (!deletedFund) {
      res.status(404).json({
        success: false,
        message: "Saved fund not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Fund removed successfully",
      data: deletedFund,
    });
  } catch (error) {
    console.error("Remove fund error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove fund",
    });
  }
};

// Check if a fund is saved by user
export const isFundSaved = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { schemeCode } = req.params;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!schemeCode) {
      res.status(400).json({
        success: false,
        message: "Scheme code is required",
      });
      return;
    }

    const savedFund = await SavedFund.findOne({
      userId,
      schemeCode,
    });

    res.json({
      success: true,
      isSaved: !!savedFund,
      data: savedFund || null,
    });
  } catch (error) {
    console.error("Check fund saved error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check fund status",
    });
  }
};

// Update fund NAV
export const updateFundNav = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { schemeCode } = req.params;
    const { currentNav } = req.body;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!schemeCode || !currentNav) {
      res.status(400).json({
        success: false,
        message: "Scheme code and current NAV are required",
      });
      return;
    }

    const updatedFund = await SavedFund.findOneAndUpdate(
      { userId, schemeCode },
      { currentNav, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedFund) {
      res.status(404).json({
        success: false,
        message: "Saved fund not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Fund NAV updated successfully",
      data: updatedFund,
    });
  } catch (error) {
    console.error("Update fund NAV error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update fund NAV",
    });
  }
};
