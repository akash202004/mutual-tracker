import type { MutualFund, MutualFundDetail, SavedFund } from "../types";

const MF_API_BASE = "https://api.mfapi.in/mf";

export const mutualFundsApi = {
  async searchFunds(query: string): Promise<MutualFund[]> {
    try {
      const response = await fetch(`${MF_API_BASE}`);
      if (!response.ok) throw new Error("Failed to fetch mutual funds");

      const funds: MutualFund[] = await response.json();

      return funds
        .filter((fund) =>
          fund.schemeName.toLocaleLowerCase(query.toLowerCase())
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
      const res = await fetch(MF_API_BASE );
      if (!res.ok) throw new Error("Failed to fetch saved funds");

      return await res.json();
    } catch (err) {
      console.error("Error fetching saved funds:", err);
      return [];
    }
  },

  async saveFund(fund: SavedFund): Promise<void> {
    try {
      const res = await fetch(MF_API_BASE , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fund),
      });

      if (!res.ok) throw new Error("Failed to save fund");
    } catch (err) {
      console.error("Error saving fund:", err);
    }
  },

  async removeFund(schemeCode: string): Promise<void> {
    try {
      const res = await fetch(`${MF_API_BASE }/${schemeCode}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to remove fund");
    } catch (err) {
      console.error("Error removing fund:", err);
    }
  },

  async isFundSaved(schemeCode: string): Promise<boolean> {
    try {
      const res = await fetch(`${MF_API_BASE }/${schemeCode}`);
      if (!res.ok) {
        if (res.status === 404) return false;
        throw new Error("Failed to check fund");
      }

      return true;
    } catch (err) {
      console.error("Error checking if fund is saved:", err);
      return false;
    }
  },
};