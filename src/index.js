import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import DaMengConnection from './database.js';

class DaMengMCPServer {
  constructor(config) {
    this.server = new McpServer(
      {
        name: 'dameng-mcp-server',
        version: '1.0.0'
      }
    );
    this.db = new DaMengConnection(config);
    this.setupHandlers();
  }

  setupHandlers() {
    this.server.registerTool('execute_sql', {
      description: 'Execute a SQL query on DaMeng database',
      inputSchema: {
        sql: z.string().describe('The SQL query to execute')
      }
    }, async (args) => {
      const { sql } = args;
      try {
        const result = await this.db.query(sql);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        throw new Error(`SQL execution failed: ${error.message}`);
      }
    });

    this.server.registerTool('list_tables', {
      description: 'List all tables in the database',
      inputSchema: {}
    }, async () => {
      try {
        const result = await this.db.query(`
          SELECT TABLE_NAME 
          FROM ALL_TABLES 
          WHERE OWNER = USER
          ORDER BY TABLE_NAME
        `);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        throw new Error(`Failed to list tables: ${error.message}`);
      }
    });

    this.server.registerTool('describe_table', {
      description: 'Describe the structure of a specific table',
      inputSchema: {
        table_name: z.string().describe('The name of the table to describe')
      }
    }, async (args) => {
      const { table_name } = args;
      try {
        const result = await this.db.query(`
          SELECT 
            COLUMN_NAME,
            DATA_TYPE,
            DATA_LENGTH,
            NULLABLE,
            DATA_DEFAULT
          FROM ALL_TAB_COLUMNS
          WHERE TABLE_NAME = UPPER(?)
          ORDER BY COLUMN_ID
        `, [table_name]);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        throw new Error(`Failed to describe table: ${error.message}`);
      }
    });

    this.server.registerTool('get_schema_info', {
      description: 'Get information about the database schema',
      inputSchema: {}
    }, async () => {
      try {
        const result = await this.db.query(`
          SELECT 
            USERNAME,
            CREATED
          FROM ALL_USERS
          ORDER BY USERNAME
        `);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        throw new Error(`Failed to get schema info: ${error.message}`);
      }
    });
  }

  async start() {
    await this.db.connect();
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('DaMeng MCP Server started');
  }

  async stop() {
    await this.db.close();
  }
}

const config = {
  host: process.env.DAMENG_HOST || 'localhost',
  port: parseInt(process.env.DAMENG_PORT) || 5236,
  user: process.env.DAMENG_USER || 'SYSDBA',
  password: process.env.DAMENG_PASSWORD || 'SYSDBA',
  schema: process.env.DAMENG_SCHEMA || 'SYSDBA',
  poolSize: parseInt(process.env.DAMENG_POOL_SIZE) || 10
};

const server = new DaMengMCPServer(config);
server.start().catch(console.error);

process.on('SIGINT', async () => {
  await server.stop();
  process.exit(0);
});
