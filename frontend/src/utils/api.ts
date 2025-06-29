import type { MutualFund, MutualFundDetail, SavedFund } from "../types";

const MF_API_BASE = import.meta.env.VITE_MF;
const BACKEND_API_BASE = import.meta.env.VITE_BASE;

export const mutualFundsApi = {
  async searchFunds(query: string): Promise<MutualFund[]> {
    try {
      const response = await fetch(`${MF_API_BASE}`);
      if (!response.ok) throw new Error("Failed to fetch mutual funds");

      const funds: MutualFund[] = await response.json();

      return funds
        .filter((fund) =>
          fund.schemeName.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 20);
    } catch (error) {
      console.error("Error searching funds:", error);
      throw new Error("Failed to search mutual funds");
    }
  },

  async getFundDetails(schemeCode: string): Promise<MutualFundDetail> {
    try {
      const response = await fetch(`${MF_API_BASE}/${schemeCode}`);
      if (!response.ok) throw new Error("Failed to fetch mutual fund details");

      return await response.json();
    } catch (error) {
      console.error("Error fetching fund detail:", error);
      throw new Error("Failed to fetch fund details");
    }
  },
};

export const savedFundsApi = {
  async getSavedFunds(): Promise<SavedFund[]> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found - user not authenticated");
        return [];
      }

      const response = await fetch(`${BACKEND_API_BASE}/saved-funds`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log("User not authenticated");
          return [];
        }
        throw new Error("Failed to fetch saved funds");
      }

      const result = await response.json();
      return result.data || [];
    } catch (err) {
      console.error("Error fetching saved funds:", err);
      return [];
    }
  },

  async getCurrentUserId(): Promise<string | null> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return null;
      }

      const response = await fetch(
        `${BACKEND_API_BASE}/users/current-user-id`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          return null;
        }
        throw new Error("Failed to get current user ID");
      }

      const result = await response.json();
      return result.userId || null;
    } catch (err) {
      console.error("Error getting current user ID:", err);
      return null;
    }
  },

  async saveFundWithUserCheck(fund: Omit<SavedFund, "userId">): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      console.log("Current user ID:", userId);

      await this.saveFund(fund);

      console.log("Fund saved successfully for user:", userId);
    } catch (err) {
      console.error("Error in saveFundWithUserCheck:", err);
      throw err;
    }
  },

  async saveFund(fund: SavedFund): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      console.log("API: Saving fund with data:", fund);
      console.log("API: schemeCode:", fund.schemeCode);
      console.log("API: schemeName:", fund.schemeName);

      const response = await fetch(`${BACKEND_API_BASE}/saved-funds`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fund),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("API: Backend error response:", error);
        throw new Error(error.message || "Failed to save fund");
      }
    } catch (err) {
      console.error("Error saving fund:", err);
      throw err;
    }
  },

  async removeFund(schemeCode: string): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(
        `${BACKEND_API_BASE}/saved-funds/${schemeCode}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to remove fund");
      }
    } catch (err) {
      console.error("Error removing fund:", err);
      throw err;
    }
  },

  async isFundSaved(schemeCode: string): Promise<boolean> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return false;
      }

      const response = await fetch(
        `${BACKEND_API_BASE}/saved-funds/check/${schemeCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          return false;
        }
        throw new Error("Failed to check fund");
      }

      const result = await response.json();
      return result.isSaved || false;
    } catch (err) {
      console.error("Error checking if fund is saved:", err);
      return false;
    }
  },
};
