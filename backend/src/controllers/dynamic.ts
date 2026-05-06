import { Request, Response } from 'express';
import { query } from '../services/db';
import { config } from '../config/loader';
import { z } from 'zod';

const getTableConfig = (tableName: string) => {
  return config.tables.find(t => t.name === tableName);
};

const createSchema = (tableName: string) => {
  const tableConfig = getTableConfig(tableName);
  if (!tableConfig) return null;

  const shape: any = {};
  tableConfig.fields.forEach(field => {
    let s = z.string();
    if (field.type === 'email') s = s.email();
    if (field.required) {
        shape[field.name] = s;
    } else {
        shape[field.name] = s.optional();
    }
  });
  return z.object(shape);
};

export const dynamicController = {
  async getAll(req: Request, res: Response) {
    const { table } = req.params;
    const userId = (req as any).user?.id;

    try {
      const result = await query(
        'SELECT * FROM dynamic_data WHERE table_name = $1 AND user_id = $2',
        [table, userId]
      );
      res.json(result.rows.map((r: any) => ({ id: r.id, ...r.data })));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req: Request, res: Response) {
    const { table } = req.params;
    const userId = (req as any).user?.id;
    const data = req.body;

    const schema = createSchema(table as string);
    if (schema) {
      const validation = schema.safeParse(data);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.format() });
      }
    }

    try {
      const result = await query(
        'INSERT INTO dynamic_data (table_name, data, user_id) VALUES ($1, $2, $3) RETURNING *',
        [table, data, userId]
      );
      res.status(201).json({ id: result.rows[0].id, ...result.rows[0].data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    const { table, id } = req.params;
    const userId = (req as any).user?.id;
    const data = req.body;

    try {
      const result = await query(
        'UPDATE dynamic_data SET data = $1 WHERE table_name = $2 AND id = $3 AND user_id = $4 RETURNING *',
        [data, table, id, userId]
      );
      if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
      res.json({ id: result.rows[0].id, ...result.rows[0].data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    const { table, id } = req.params;
    const userId = (req as any).user?.id;

    try {
      const result = await query(
        'DELETE FROM dynamic_data WHERE table_name = $1 AND id = $2 AND user_id = $3',
        [table, id, userId]
      );
      if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};
