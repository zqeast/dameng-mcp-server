import dmdb from 'dmdb';

class DaMengConnection {
  constructor(config) {
    this.config = config;
    this.connection = null;
  }

  async connect() {
    try {
      console.log('Connecting to DaMeng database...', this.config);
      const connectString = `dm://${this.config.user}:${this.config.password}@${this.config.host}:${this.config.port}?schema=${this.config.schema || 'SYSDBA'}`;
      console.log('Connecting to DaMeng database...', connectString);
      this.connection = await dmdb.createPool({
        connectString: connectString,
        poolMax: this.config.poolSize || 10,
        poolMin: 1
      });
      return this.connection;
    } catch (error) {
      throw new Error(`Failed to connect to DaMeng database: ${error.message}`);
    }
  }

  async execute(sql, params = []) {
    if (!this.connection) {
      await this.connect();
    }

    try {
      const conn = await this.connection.getConnection();
      try {
        const result = await conn.execute(sql, params);
        return result;
      } finally {
        await conn.close();
      }
    } catch (error) {
      throw new Error(`Failed to execute SQL: ${error.message}`);
    }
  }

  async query(sql, params = []) {
    if (!this.connection) {
      await this.connect();
    }

    try {
      const conn = await this.connection.getConnection();
      try {
        const result = await conn.execute(sql, params);
        return result;
      } finally {
        await conn.close();
      }
    } catch (error) {
      throw new Error(`Failed to query database: ${error.message}`);
    }
  }

  async close() {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }
}

export default DaMengConnection;
