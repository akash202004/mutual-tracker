import type { MutualFund, MutualFundDetail } from "../types";

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
