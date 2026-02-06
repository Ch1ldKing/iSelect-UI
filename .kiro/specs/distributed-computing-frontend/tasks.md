# Implementation Plan(请使用 pnpm)

- [x] 1. 项目初始化和基础配置
  - 使用 Vite 创建 React + TypeScript 项目
  - 安装核心依赖：react-router-dom, zustand, antd, recharts, axios
  - 配置 Vite（路径别名、代理、构建选项）
  - 配置 TypeScript（严格模式、路径映射）
  - 创建项目目录结构
  - _Requirements: 所有需求的基础_

- [x] 2. 类型定义和接口
  - 创建 `src/types/auth.ts` 定义认证相关类型
  - 创建 `src/types/worker.ts` 定义 Worker 相关类型
  - 创建 `src/types/task.ts` 定义任务相关类型
  - 创建 `src/types/file.ts` 定义文件相关类型
  - 创建 `src/types/common.ts` 定义通用类型
  - _Requirements: 1.1, 1.2, 4.1, 4.2, 5.1, 6.1, 7.1, 8.1_

- [x] 3. 主题配置和样式系统
  - 创建 `src/theme/index.ts` 配置 Ant Design 主题
  - 创建 `src/theme/colors.ts` 定义颜色系统
  - 创建 `src/theme/breakpoints.ts` 定义响应式断点
  - 配置绿色主题（主色 #52c41a）
  - 定制 Table、Button、Card、Progress 组件样式
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10_

- [x] 4. API 服务层实现
  - 创建 `src/api/client.ts` 配置 Axios 实例
  - 实现请求拦截器（添加 Authorization header）
  - 实现响应拦截器（统一错误处理）
  - 创建 `src/api/clientService.ts` 实现认证 API
  - 创建 `src/api/workerService.ts` 实现 Worker API
  - 创建 `src/api/taskService.ts` 实现任务 API
  - 创建 `src/api/fileService.ts` 实现文件 API
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9_

- [x] 5. Zustand 状态管理实现
  - 创建 `src/store/authStore.ts` 实现认证状态管理
  - 实现 login、logout、registerClient、initAuth 方法
  - 创建 `src/store/workerStore.ts` 实现 Worker 状态管理
  - 实现 fetchWorkers、startPolling、stopPolling 方法
  - 创建 `src/store/taskStore.ts` 实现任务状态管理
  - 实现 createTask、fetchTaskDetail、startPolling、stopPolling 方法
  - 创建 `src/store/fileStore.ts` 实现文件状态管理
  - 实现 uploadFile、fetchFiles 方法
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [x] 6. 工具函数实现
  - 创建 `src/utils/format.ts` 实现格式化函数
  - 实现 formatFileSize、formatDateTime、formatPercent、calculateProgress
  - 创建 `src/utils/validators.ts` 实现验证函数
  - 实现 validateEmail、validatePassword、validateFileType、validateFileSize
  - 创建 `src/utils/helpers.ts` 实现辅助函数
  - 实现 isWorkerOnline 判断 Worker 在线状态（已在 workerStore 中实现）
  - _Requirements: 11.7, 5.4, 5.5_

- [x] 7. 通用组件实现
  - 创建 `src/components/common/StatusBadge.tsx` 状态徽章组件
  - 创建 `src/components/common/ProgressBar.tsx` 进度条组件
  - 创建 `src/components/common/DataTable.tsx` 数据表格组件
  - 创建 `src/components/ProtectedRoute.tsx` 路由守卫组件
  - _Requirements: 9.4, 8.6, 8.7, 8.8, 8.9, 1.8_

- [x] 8. 布局组件实现
  - 创建 `src/layouts/MainLayout.tsx` 主布局组件
  - 实现 Header、Sidebar、Content 三栏布局
  - 创建 `src/layouts/Header.tsx` 顶部导航栏
  - 显示 Logo、用户信息、登出按钮
  - 创建 `src/layouts/Sidebar.tsx` 侧边导航菜单
  - 实现菜单项：仪表盘、Worker、文件、任务、设置
  - 实现响应式侧边栏折叠功能
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_

- [x] 9. 认证页面实现
- [x] 9.1 创建登录页面
  - 创建 `src/pages/auth/Login.tsx` 登录页面
  - 实现登录表单（Client ID、用户名、密码）
  - 实现表单验证和提交逻辑
  - 调用 authStore.login 方法
  - 登录成功后重定向到仪表盘
  - _Requirements: 1.4, 1.5, 1.6, 1.7_

- [x] 9.2 创建公司注册页面
  - 创建 `src/pages/auth/Register.tsx` 公司注册页面
  - 实现注册表单（公司名称、管理员用户名、密码）
  - 实现表单验证（密码强度验证）
  - 调用 authStore.registerClient 方法
  - 注册成功后自动重定向到仪表盘
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 9.3 创建认证页面布局
  - 创建 `src/layouts/AuthLayout.tsx` 认证页面布局
  - 实现居中的卡片式布局
  - 添加 Logo 和标题
  - 应用绿色主题样式
  - _Requirements: 1.8, 10.1_

- [x] 10. 仪表盘页面实现
- [x] 10.1 创建统计卡片组件
  - 创建 `src/components/dashboard/StatCard.tsx` 统计卡片组件
  - 接收 title、value、icon、color 等 props
  - 使用 Ant Design Card 组件
  - 应用绿色主题样式
  - _Requirements: 3.1, 10.1_

- [x] 10.2 创建资源使用趋势图组件
  - 创建 `src/components/dashboard/ResourceChart.tsx` 资源使用趋势图
  - 使用 Recharts LineChart 实现折线图
  - 显示 CPU、内存、显存使用率随时间变化
  - 应用绿色系配色方案
  - _Requirements: 3.6, 10.8_

- [x] 10.3 创建任务状态分布图组件
  - 创建 `src/components/dashboard/TaskStatusChart.tsx` 任务状态分布图
  - 使用 Recharts PieChart 实现饼图
  - 显示不同状态任务的数量分布
  - 应用绿色系配色方案
  - _Requirements: 3.7, 10.8_

- [x] 10.4 创建实时任务列表组件
  - 创建 `src/components/dashboard/RealtimeTaskList.tsx` 实时任务列表
  - 显示最近的任务及其进度
  - 使用 StatusBadge 和 ProgressBar 组件
  - _Requirements: 3.8_

- [x] 10.5 创建仪表盘主页面
  - 创建 `src/pages/dashboard/Dashboard.tsx` 仪表盘主页面
  - 集成 StatCard 组件显示四个统计指标
  - 集成 ResourceChart 和 TaskStatusChart
  - 集成 RealtimeTaskList
  - 从 workerStore 和 taskStore 获取数据
  - 实现 5 秒轮询更新数据
  - 组件卸载时清除轮询定时器
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.9, 3.10, 14.1_

- [x] 11. Worker 列表页面实现
- [x] 11.1 创建 Worker 表格组件
  - 创建 `src/components/worker/WorkerTable.tsx` Worker 表格组件
  - 使用 Ant Design Table 组件
  - 定义列：状态、Worker ID、CPU 使用率、内存使用率、显存使用率、操作
  - 使用 StatusBadge 显示在线/离线状态
  - 使用 ProgressBar 显示资源使用率
  - CPU 使用率超过 80% 显示橙色警告
  - 实现"查看详情"按钮导航到详情页
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 11.2 创建 Worker 列表页面
  - 创建 `src/pages/workers/WorkerList.tsx` Worker 列表页面
  - 集成 WorkerTable 组件
  - 从 workerStore 获取 Worker 数据
  - 实现搜索框（按 Worker ID 搜索）
  - 实现状态筛选下拉框（全部/在线/离线）
  - 实现刷新按钮
  - 实现 5 秒轮询更新数据
  - 组件卸载时清除轮询定时器
  - _Requirements: 4.1, 4.7, 4.8, 4.9, 14.2_

- [x] 12. Worker 详情页面实现
- [x] 12.1 创建 Worker 信息卡片组件
  - 创建 `src/components/worker/WorkerCard.tsx` Worker 信息卡片
  - 使用 Ant Design Card 和 Descriptions 组件
  - 显示 Worker ID、CPU 核心数、CPU 频率、内存大小、显存大小
  - 显示当前状态（在线/离线）
  - 应用绿色主题样式
  - _Requirements: 4.11_

- [x] 12.2 创建资源监控图表组件
  - 创建 `src/components/worker/ResourceMonitor.tsx` 资源监控组件
  - 使用 Recharts LineChart 实现实时资源监控
  - 显示 CPU、内存、显存使用率随时间变化
  - 支持切换不同资源类型的显示
  - 应用绿色系配色方案
  - _Requirements: 4.12_

- [x] 12.3 创建 Worker 详情页面
  - 创建 `src/pages/workers/WorkerDetail.tsx` Worker 详情页面
  - 从路由参数获取 worker_id
  - 集成 WorkerCard 组件
  - 集成 ResourceMonitor 组件
  - 实现 3 秒轮询更新资源数据
  - 组件卸载时清除轮询定时器
  - _Requirements: 4.10, 4.13, 14.3_

- [x] 13. 文件管理页面实现
- [x] 13.1 创建文件上传组件
  - 创建 `src/components/file/FileUpload.tsx` 文件上传组件
  - 使用 Ant Design Upload 组件
  - 实现拖拽上传功能
  - 实现文件类型验证（仅 CSV）
  - 实现文件大小验证（最大 100MB）
  - 使用 validateFileType 和 validateFileSize 工具函数
  - 实现上传进度显示
  - 调用 fileStore.uploadFile 方法
  - 上传成功后显示成功消息
  - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 13.2 创建文件列表组件
  - 创建 `src/components/file/FileList.tsx` 文件列表组件
  - 使用 Ant Design Table 组件
  - 显示文件名、文件大小、上传时间、操作按钮
  - 使用 formatFileSize 和 formatDateTime 格式化显示
  - 实现"预览"按钮（在 Modal 中显示 CSV 前 100 行）
  - 实现"下载"按钮
  - _Requirements: 5.9, 5.10, 5.11_

- [x] 13.3 创建文件管理页面
  - 创建 `src/pages/files/FileManagement.tsx` 文件管理页面
  - 集成 FileUpload 组件
  - 集成 FileList 组件
  - 从 fileStore 获取文件列表
  - 页面加载时调用 fetchFiles
  - 上传成功后刷新文件列表
  - _Requirements: 5.1, 5.8_

- [x] 14. 任务列表页面实现
- [x] 14.1 创建任务表格组件
  - 创建 `src/components/task/TaskTable.tsx` 任务表格组件
  - 使用 Ant Design Table 组件
  - 定义列：任务 ID、算法名称、状态、创建时间、操作
  - 使用 StatusBadge 显示任务状态
  - 使用 formatDateTime 格式化创建时间
  - 实现"查看详情"按钮导航到详情页
  - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [x] 14.2 创建任务列表页面
  - 创建 `src/pages/tasks/TaskList.tsx` 任务列表页面
  - 集成 TaskTable 组件
  - 从 taskStore 获取任务列表
  - 实现搜索框（按任务 ID 或算法名称搜索）
  - 实现状态筛选下拉框（全部/运行中/成功/失败）
  - 实现"创建任务"按钮导航到创建页面
  - 实现 5 秒轮询更新任务状态
  - 组件卸载时清除轮询定时器
  - _Requirements: 7.1, 7.6, 7.7, 7.8, 7.9, 14.4_

- [x] 15. 任务创建页面实现
- [x] 15.1 创建任务创建页面
  - 创建 `src/pages/tasks/TaskCreate.tsx` 任务创建页面
  - 使用 Ant Design Form 组件
  - 实现算法选择下拉框（function_id）
  - 实现文件选择下拉框（显示最近上传的文件）
  - 实现任务参数配置输入框（task_volume）
  - 实现表单验证（必须选择文件和算法）
  - 未选择文件或算法时禁用提交按钮
  - 调用 taskStore.createTask 方法
  - 任务创建成功后导航到任务详情页面
  - 实现错误处理（显示后端返回的错误消息）
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 6.11_

- [x] 16. 任务详情页面实现
- [x] 16.1 创建任务信息卡片组件
  - 创建 `src/components/task/TaskInfo.tsx` 任务信息卡片
  - 使用 Ant Design Card 和 Descriptions 组件
  - 显示任务 ID、算法、状态、创建时间、完成时间、重试次数
  - 使用 StatusBadge 显示任务状态
  - 使用 formatDateTime 格式化时间
  - _Requirements: 8.2_

- [x] 16.2 创建任务进度组件
  - 创建 `src/components/task/TaskProgress.tsx` 任务进度组件
  - 使用 ProgressBar 组件
  - 使用 calculateProgress 工具函数计算整体进度
  - 显示进度百分比和状态文本
  - _Requirements: 8.3_

- [x] 16.3 创建子任务表格组件
  - 创建 `src/components/task/SubtaskTable.tsx` 子任务表格
  - 使用 Ant Design Table 组件
  - 显示子任务 ID、Worker ID、数据范围、状态、进度
  - 使用 StatusBadge 显示子任务状态
  - 使用 ProgressBar 显示子任务进度
  - 显示错误信息（如果子任务失败）
  - _Requirements: 8.4, 8.5, 8.6, 8.7, 8.8, 8.9_

- [x] 16.4 创建任务详情页面
  - 创建 `src/pages/tasks/TaskDetail.tsx` 任务详情页面
  - 从路由参数获取 task_id
  - 集成 TaskInfo、TaskProgress、SubtaskTable 组件
  - 从 taskStore 获取任务详情
  - 实现 3 秒轮询更新任务状态
  - 任务完成（成功或失败）时停止轮询
  - 组件卸载时清除轮询定时器
  - 实现"下载结果"按钮（任务成功时显示）
  - 实现"重试任务"按钮（任务失败时显示）
  - 实现"取消任务"按钮（任务运行中时显示）
  - _Requirements: 8.1, 8.10, 8.11, 8.12, 8.13, 8.14, 8.15, 14.5, 14.8_

- [x] 17. 用户注册管理页面实现
- [x] 17.1 创建用户管理组件
  - 创建 `src/components/settings/UserManagement.tsx` 用户管理组件
  - 实现"添加新用户"按钮
  - 实现用户注册 Modal 表单（用户名、密码）
  - 实现表单验证（密码强度验证）
  - 调用 clientService.registerUser 方法
  - 实现用户列表展示（如果后端支持）
  - 注册成功后显示成功消息并关闭 Modal
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 17.2 创建设置页面
  - 创建 `src/pages/settings/Settings.tsx` 设置页面
  - 集成 UserManagement 组件
  - 使用 Tabs 组件支持未来扩展其他设置项
  - _Requirements: 2.1_

- [x] 18. 路由配置和应用入口
- [x] 18.1 配置应用路由
  - 更新 `src/App.tsx` 应用主组件
  - 使用 BrowserRouter 配置 React Router
  - 配置公开路由：/login, /register（使用 AuthLayout）
  - 配置受保护路由：/, /dashboard, /workers, /workers/:id, /files, /tasks, /tasks/create, /tasks/:id, /settings
  - 使用 ProtectedRoute 包装受保护路由
  - 使用 MainLayout 作为受保护路由的布局
  - 应用 Ant Design ConfigProvider 和绿色主题
  - 实现根路径 / 重定向到 /dashboard
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 1.8_

- [x] 18.2 配置应用入口
  - 更新 `src/main.tsx` 应用入口
  - 在应用启动时调用 authStore.initAuth() 恢复认证状态
  - 确保 React StrictMode 包装
  - _Requirements: 12.3_

- [x] 19. 错误处理和用户反馈优化
- [x] 19.1 优化错误处理
  - 验证 API 错误拦截器已正确实现（已在 client.ts 中完成）
  - 验证 401 错误自动登出和重定向（已在 client.ts 中完成）
  - 在各页面表单中实现验证错误提示
  - 在数据加载时显示 Spin 或 Skeleton 组件
  - 在操作成功时显示 message.success（已在 stores 中实现）
  - 在表格无数据时显示空状态提示（使用 Table 的 locale 属性）
  - 在危险操作前显示确认对话框（使用 Modal.confirm）
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9_

- [x] 20. 响应式设计优化
- [x] 20.1 实现响应式布局
  - 验证移动设备上的侧边栏折叠（已在 MainLayout 中实现）
  - 为统计卡片添加响应式网格布局（使用 Row 和 Col）
  - 为表格添加响应式配置（使用 Table 的 scroll 属性）
  - 为图表添加响应式尺寸（使用 ResponsiveContainer）
  - 添加必要的 CSS 媒体查询
  - _Requirements: 9.7, 9.8_

- [ ] 21. 可访问性增强
- [ ] 21.1 提升可访问性
  - 为所有图标按钮添加 aria-label 属性
  - 确保所有表单输入有清晰的 label
  - 验证键盘导航支持（Tab、Enter、Space）
  - 添加焦点指示器样式
  - 验证颜色对比度符合 WCAG AA 标准
  - 为纯图标元素添加 title 或文本说明
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8_

- [ ]* 22. 单元测试
  - 为格式化工具函数编写测试
  - 为验证工具函数编写测试
  - 为 Zustand stores 编写测试
  - 为通用组件编写测试
  - _Requirements: 所有需求的质量保证_

- [ ] 23. 环境配置和文档
- [ ] 23.1 配置环境变量
  - 创建 .env.development 文件（配置开发环境 API 地址）
  - 创建 .env.production 文件（配置生产环境 API 地址）
  - 更新 .gitignore 排除环境变量文件
  - _Requirements: 所有需求的部署基础_

- [ ] 23.2 编写项目文档
  - 创建或更新 README.md 项目说明文档
  - 编写项目安装和运行说明
  - 编写项目结构说明
  - 编写开发指南和注意事项
  - 添加 API 接口说明
  - _Requirements: 所有需求的文档支持_
