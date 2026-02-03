# DaMeng MCP Server

[达梦数据库](https://eco.dameng.com/) 的 [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) 实现，支持在 AI 助手中直接操作达梦数据库。

[![NPM Version](https://img.shields.io/npm/v/dameng-mcp-server)](https://www.npmjs.com/package/dameng-mcp-server)
[![License](https://img.shields.io/npm/l/dameng-mcp-server)](https://github.com/zqeast/dameng-mcp-server/blob/main/LICENSE)
[![Node Version](https://img.shields.io/node/v/dameng-mcp-server)](https://github.com/zqeast/dameng-mcp-server/blob/main/package.json)

## 功能特性

- 执行 SQL 查询
- 列出数据库表
- 描述表结构
- 获取数据库模式信息
- 支持连接池管理
- 完整的输入验证

## 快速开始

### 安装

使用 npm 全局安装：

```bash
npm install -g dameng-mcp-server
```

或使用 npx（无需安装）：

```bash
npx dameng-mcp-server
```

### 配置

创建 `.env` 文件并配置数据库连接信息：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
DAMENG_HOST=localhost
DAMENG_PORT=5236
DAMENG_USER=SYSDBA
DAMENG_PASSWORD=your_password
DAMENG_SCHEMA=SYSDBA
DAMENG_POOL_SIZE=10
```

### 启动

```bash
dameng-mcp-server
```

## 在 Trae IDE 中使用

1. 打开 MCP 设置
2. 手动添加 MCP
3. 使用以下配置：

```json
{
  "mcpServers": {
    "dameng-mcp-server": {
      "command": "npx",
      "args": ["dameng-mcp-server"],
      "env": {
        "DAMENG_HOST": "localhost",
        "DAMENG_PORT": "5236",
        "DAMENG_USER": "SYSDBA",
        "DAMENG_PASSWORD": "your_password",
        "DAMENG_SCHEMA": "SYSDBA",
        "DAMENG_POOL_SIZE": "10"
      }
    }
  }
}
```

## MCP 工具

### execute_sql

执行 SQL 查询并返回结果。

**参数：**

| 参数 | 类型 | 必需 | 说明 |
|------|------|--------|------|
| sql | string | 是 | 要执行的 SQL 语句 |

**示例：**

```json
{
  "sql": "SELECT * FROM users LIMIT 10"
}
```

### list_tables

列出数据库中的所有表。

**参数：** 无


### describe_table

描述指定表的结构，包括列名、数据类型等信息。

**参数：**

| 参数 | 类型 | 必需 | 说明 |
|------|------|--------|------|
| table_name | string | 是 | 要描述的表名 |

**示例：**

```json
{
  "table_name": "users"
}
```

### get_schema_info

获取数据库模式信息，包括所有表和视图的详细信息。

**参数：** 无

## 环境变量

| 变量 | 必需 | 默认值 | 说明 |
|-------|--------|----------|------|
| DAMENG_HOST | 是 | - | 数据库主机地址 |
| DAMENG_PORT | 是 | - | 数据库端口（默认 5236） |
| DAMENG_USER | 是 | - | 数据库用户名 |
| DAMENG_PASSWORD | 是 | - | 数据库密码 |
| DAMENG_SCHEMA | 是 | - | 数据库模式名 |
| DAMENG_POOL_SIZE | 否 | 10 | 连接池大小 |

## 项目结构

```
dameng-mcp-server/
├── src/
│   ├── index.js          # MCP 服务器主入口
│   └── database.js       # 达梦数据库连接模块
├── .github/
│   └── workflows/
│       └── publish.yml    # NPM 发布工作流
├── package.json
├── .env.example
├── .npmignore
├── LICENSE
└── README.md
```

## 技术栈

- **@modelcontextprotocol/sdk**: MCP SDK
- **dmdb**: 达梦数据库 Node.js 驱动
- **zod**: 输入验证
- **dotenv**: 环境变量管理

## 系统要求

- Node.js >= 18.0.0

## 故障排除

### 连接失败

- 确认达梦数据库服务已启动
- 检查 `.env` 文件中的连接配置
- 验证网络连接和防火墙设置

### dmdb 驱动问题

首次使用 dmdb 驱动可能需要编译，确保系统已安装必要的编译工具：

**Ubuntu/Debian:**
```bash
sudo apt-get install build-essential
```

**macOS:**
```bash
xcode-select --install
```

**Windows:**
安装 Visual Studio Build Tools

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

[MIT](https://github.com/zqeast/dameng-mcp-server/blob/main/LICENSE)

## 作者

[zqeast](https://github.com/zqeast) <zqeast@gmail.com>

## 相关链接

- [NPM Package](https://www.npmjs.com/package/dameng-mcp-server)
- [GitHub Repository](https://github.com/zqeast/dameng-mcp-server)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [达梦数据库](https://eco.dameng.com/)
