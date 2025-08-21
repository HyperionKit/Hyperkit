import { google } from 'googleapis';
import path from 'path';

// Google Sheets API configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

interface WhitelistEntry {
  address: string;
  walletType: string;
  timestamp: string;
  joinedAt: string;
}

export class GoogleSheetsService {
  private auth: any;
  private sheets: any;

  constructor() {
    console.log('Initializing GoogleSheetsService...');
    console.log('SHEET_ID:', SHEET_ID ? 'Set' : 'Missing');
    
    if (!SHEET_ID) {
      console.warn('Google Sheet ID not configured - using mock mode');
      return;
    }

    try {
      // Initialize service account authentication using keyFile
      const keyFilePath = path.join(process.cwd(), 'app', 'whitelist', 'hyperkit-whitelist-0d6596b35a1e.json');
      
      const auth = new google.auth.GoogleAuth({
        keyFile: keyFilePath,
        scopes: SCOPES,
      });
      
      this.auth = auth;
      this.sheets = google.sheets({ version: 'v4', auth });
      console.log('✅ GoogleSheetsService initialized with Service Account using keyFile');
    } catch (error) {
      console.error('Error initializing Google Sheets service:', error);
      console.log('Falling back to mock mode');
    }
  }

  /**
   * Check if a wallet address is already whitelisted
   */
  async isAddressWhitelisted(address: string): Promise<boolean> {
    try {
      if (!this.sheets) {
        console.log('Mock mode: Checking if address is whitelisted:', address);
        return false; // Mock: always new user
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Whitelist!A:A', // Wallet addresses are in column A
      });

      const values = response.data.values || [];
      return values.some((row: any) => row[0]?.toLowerCase() === address.toLowerCase());
    } catch (error) {
      console.error('Error checking whitelist status:', error);
      return false;
    }
  }

  /**
   * Add a new entry to the whitelist
   */
  async addToWhitelist(entry: WhitelistEntry): Promise<boolean> {
    try {
      if (!this.sheets) {
        console.log('Mock mode: Adding to whitelist:', entry);
        return true; // Mock: always successful
      }

      console.log('Attempting to add to whitelist with sheet ID:', SHEET_ID);
      console.log('Entry data:', entry);

      const values = [
        [
          entry.address,
          entry.walletType,
          entry.timestamp,
          entry.joinedAt,
          new Date().toISOString(), // Last updated
        ],
      ];

      const result = await this.sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'Whitelist!A:E', // Append to columns A-E
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values,
        },
      });

      console.log('Google Sheets API response:', result.data);
      return true;
    } catch (error) {
      console.error('Error adding to whitelist:', error);
      console.error('Error details:', {
        message: (error as any).message,
        code: (error as any).code,
        status: (error as any).status,
        sheetId: SHEET_ID
      });
      return false;
    }
  }

  /**
   * Get all whitelisted addresses
   */
  async getAllWhitelistedAddresses(): Promise<string[]> {
    try {
      if (!this.sheets) {
        console.log('Mock mode: Getting all whitelisted addresses');
        return []; // Mock: empty list
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Whitelist!A:A',
      });

      const values = response.data.values || [];
      return values.slice(1).map((row: any) => row[0]).filter(Boolean); // Skip header row
    } catch (error) {
      console.error('Error getting whitelist:', error);
      return [];
    }
  }

  /**
   * Get whitelist statistics
   */
  async getWhitelistStats(): Promise<{
    totalAddresses: number;
    byWalletType: Record<string, number>;
    recentJoins: number;
  }> {
    try {
      if (!this.sheets) {
        console.log('Mock mode: Getting whitelist stats');
        return {
          totalAddresses: 0,
          byWalletType: {},
          recentJoins: 0,
        };
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Whitelist!A:E',
      });

      const values = response.data.values || [];
      const dataRows = values.slice(1); // Skip header row

      const stats = {
        totalAddresses: dataRows.length,
        byWalletType: {} as Record<string, number>,
        recentJoins: 0,
      };

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      dataRows.forEach((row: any) => {
        const walletType = row[1] || 'Unknown';
        const joinedAt = new Date(row[3]);

        // Count by wallet type
        stats.byWalletType[walletType] = (stats.byWalletType[walletType] || 0) + 1;

        // Count recent joins (last 7 days)
        if (joinedAt > oneWeekAgo) {
          stats.recentJoins++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting whitelist stats:', error);
      return {
        totalAddresses: 0,
        byWalletType: {},
        recentJoins: 0,
      };
    }
  }
}

// Export a singleton instance
export const googleSheetsService = new GoogleSheetsService();
