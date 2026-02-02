# DaMeng MCP Server

基于 Node.js 的达梦数据库 MCP (Model Context Protocol) 服务器实现。

## 功能特性

- 执行 SQL 查询
- 列出数据库表
- 描述表结构
- 获取数据库模式信息

## 安装

### 全局安装（推荐）

```bash
npm install -g dameng-mcp-server
```

### 本地安装

```bash
npm install dameng-mcp-server
```

## 配置

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

## 使用

### 作为 MCP 服务器使用

#### 启动服务器

```bash
dameng-mcp-server
```

或

```bash
npm start
```

#### 开发模式

```bash
npm run dev
```

### 在 Trae IDE 中配置

1. 打开 MCP 设置
2. 添加新服务器
3. 使用以下配置：

```json
{
  "mcpServers": {
    "dameng-mcp-server": {
      "command": "dameng-mcp-server",
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

执行 SQL 查询。

**参数：**
- `sql` (string): 要执行的 SQL 语句

**示例：**
```json
{
  "sql": "SELECT * FROM users LIMIT 10"
}
```

### list_tables

列出数据库中的所有表。

**参数：** 无

**示例：**
```json
{}
```

### describe_table

描述指定表的结构。

**参数：**
- `table_name` (string): 表名

**示例：**
```json
{
  "table_name": "users"
}
```

### get_schema_info

获取数据库模式信息。

**参数：** 无

**示例：**
```json
{}
```

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

## 依赖

- `@modelcontextprotocol/sdk`: MCP SDK
- `dmdb`: 达梦数据库 Node.js 驱动
- `zod`: 输入验证
- `dotenv`: 环境变量管理

## 注意事项

- 确保达梦数据库服务已启动
- 确保 Node.js 版本 >= 18
- 首次使用 dmdb 驱动可能需要编译，确保系统已安装必要的编译工具

## 开发

### 克隆仓库

```bash
git clone https://github.com/zqeast/dameng-mcp-server.git
cd dameng-mcp-server
```

### 安装依赖

```bash
npm install
```

### 运行测试

```bash
npm test
```

### 构建项目

```bash
npm run build
```

## 发布

### 手动发布到 NPM

```bash
npm publish
```

### 自动发布

推送到 GitHub 时，如果标签符合 `v*` 模式，会自动触发发布流程。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT

## 作者

zqeast <zqeast@gmail.com>

## 链接

- [NPM Package](https://www.npmjs.com/package/dameng-mcp-server)
- [GitHub Repository](https://github.com/zqeast/dameng-mcp-server)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [达梦数据库](https://eco.dameng.com/)
