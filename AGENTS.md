# WisePenView-Portal Agent 规约

- 技术栈：Vite、React 19、TypeScript strict、Less CSS Modules、HeroUI 主题样式、Three.js。
- 本仓库只维护 WisePen 外部门户静态页，不承载登录、注册、管理端、工作区或后端 service 逻辑。
- 注释使用中文，commit message 使用中文。
- 运行脚本使用 `pnpm`：`pnpm build`、`pnpm lint`、`pnpm typecheck`、`pnpm preview`。
- 环境变量只放静态跳转配置：`VITE_MAIN_SITE_URL`、`VITE_LOGIN_URL` 和 `VITE_REGISTER_URL`。
- 修改前查看 `git status --short`，不要回滚或覆盖用户已有改动。
- UI 修改保持现有门户风格，样式使用 Less CSS Modules，类名用 camelCase。
- 默认至少运行 `pnpm lint`；涉及类型、构建或配置时运行 `pnpm typecheck` 或 `pnpm build`。
