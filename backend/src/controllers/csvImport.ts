import { Request, Response } from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import { query } from '../services/db';

export const csvImportController = {
  async import(req: Request, res: Response) {
    const { table } = req.params;
    const userId = (req as any).user?.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (file.mimetype === 'application/pdf') {
      try {
        await query(
          'INSERT INTO dynamic_data (table_name, data, user_id) VALUES ($1, $2, $3)',
          [table, { title: file.originalname, description: 'Imported PDF document', type: 'pdf' }, userId]
        );
        fs.unlinkSync(file.path);
        return res.json({ message: `Successfully imported PDF as a record to ${table}` });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    const results: any[] = [];
    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('error', (err) => res.status(500).json({ error: 'CSV parsing failed' }))
      .on('end', async () => {
        try {
          for (const row of results) {
            await query(
              'INSERT INTO dynamic_data (table_name, data, user_id) VALUES ($1, $2, $3)',
              [table, row, userId]
            );
          }
          fs.unlinkSync(file.path);
          res.json({ message: `Successfully imported ${results.length} rows to ${table}` });
        } catch (error: any) {
          res.status(500).json({ error: error.message });
        }
      });
  }
};
