import dmdb from 'dmdb';

const DEFAULT_EXECUTE_OPTIONS = {
  extendedMetaData: true
};

if (!dmdb.fetchAsString.includes(dmdb.NUMBER)) {
  dmdb.fetchAsString = [...dmdb.fetchAsString, dmdb.NUMBER];
}

const NUMERIC_TYPE_NAMES = new Set([
  'TINYINT',
  'SMALLINT',
  'INT',
  'INTEGER',
  'BIGINT',
  'NUMBER',
  'NUMERIC',
  'DEC',
  'DECIMAL',
  'REAL',
  'DOUBLE',
  'FLOAT'
]);

function isNumericColumn(column) {
  return NUMERIC_TYPE_NAMES.has(String(column?.dbTypeName || '').toUpperCase());
}

function normalizeNumericValue(value, column) {
  if (typeof value !== 'string' || !isNumericColumn(column)) {
    return value;
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return value;
  }

  if (!isLosslessNumber(value, numericValue, column)) {
    return value;
  }

  return numericValue;
}

function isLosslessNumber(value, numericValue, column) {
  const scale = column?.scale ?? 0;
  if (scale !== 0) {
    return numericValue.toFixed(scale) === value;
  }

  if (!Number.isInteger(numericValue) || !Number.isSafeInteger(numericValue)) {
    return false;
  }

  return String(numericValue) === value;
}

function normalizeRows(rows, metaData) {
  if (!Array.isArray(rows) || !Array.isArray(metaData)) {
    return rows;
  }

  return rows.map((row) => {
    if (Array.isArray(row)) {
      return row.map((value, index) => normalizeNumericValue(value, metaData[index]));
    }

    if (row && typeof row === 'object') {
      return Object.fromEntries(
        Object.entries(row).map(([key, value]) => {
          const column = metaData.find((item) => item?.name === key);
          return [key, normalizeNumericValue(value, column)];
        })
      );
    }

    return row;
  });
}

function normalizeResult(result) {
  if (!result || typeof result !== 'object') {
    return result;
  }

  return {
    ...result,
    rows: normalizeRows(result.rows, result.metaData)
  };
}

class DaMengConnection {
  constructor(config) {
    this.config = config;
    this.connection = null;
  }

  async connect() {
    try {
      const connectString = `dm://${this.config.user}:${this.config.password}@${this.config.host}:${this.config.port}?schema=${this.config.schema || 'SYSDBA'}`;
      console.error('Connecting to DaMeng database...', {
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        schema: this.config.schema || 'SYSDBA',
        poolSize: this.config.poolSize || 10
      });
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

  async execute(sql, params = [], options = {}) {
    if (!this.connection) {
      await this.connect();
    }

    try {
      const conn = await this.connection.getConnection();
      try {
        const result = await conn.execute(sql, params, {
          ...DEFAULT_EXECUTE_OPTIONS,
          ...options
        });
        return normalizeResult(result);
      } finally {
        await conn.close();
      }
    } catch (error) {
      throw new Error(`Failed to execute SQL: ${error.message}`);
    }
  }

  async query(sql, params = [], options = {}) {
    if (!this.connection) {
      await this.connect();
    }

    try {
      const conn = await this.connection.getConnection();
      try {
        const result = await conn.execute(sql, params, {
          ...DEFAULT_EXECUTE_OPTIONS,
          ...options
        });
        return normalizeResult(result);
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
