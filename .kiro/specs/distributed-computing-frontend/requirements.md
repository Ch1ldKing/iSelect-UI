# Requirements Document

## Introduction

本文档定义了 iSelect 分布式计算平台前端系统的需求。该系统是一个基于 React 的 Web 应用程序，为用户提供直观的界面来管理分布式计算资源、上传数据文件、创建和监控计算任务。系统采用绿色主题设计，使用 React Router、Zustand、Ant Design、Recharts 和 Axios 等现代前端技术栈。

系统的主要用户包括：
- 公司/机构管理员：负责注册公司账户和管理用户
- 普通用户：执行日常的文件上传、任务创建和监控操作

系统与后端 REST API 集成，提供实时的资源监控和任务状态更新功能。

## Requirements

### Requirement 1: 用户认证与授权

**User Story:** 作为一个公司管理员，我希望能够注册公司账户并管理用户，以便控制对系统的访问权限。

#### Acceptance Criteria

1. WHEN 用户访问注册页面 THEN 系统 SHALL 提供公司注册表单，包含公司名称、管理员用户名和密码字段
2. WHEN 用户提交公司注册表单 THEN 系统 SHALL 调用 `/api/client/register` 接口并返回 client_id、user_id 和 token
3. WHEN 公司注册成功 THEN 系统 SHALL 自动将用户重定向到仪表盘页面
4. WHEN 用户访问登录页面 THEN 系统 SHALL 提供登录表单，包含 Client ID、用户名和密码字段
5. WHEN 用户提交登录表单 THEN 系统 SHALL 调用 `/api/user/login` 接口验证凭据
6. WHEN 登录成功 THEN 系统 SHALL 将 token 存储在 localStorage 中并重定向到仪表盘
7. WHEN 登录失败 THEN 系统 SHALL 显示错误消息"Invalid credentials"
8. WHEN 已认证用户访问受保护路由 THEN 系统 SHALL 验证 token 的有效性
9. WHEN token 无效或过期 THEN 系统 SHALL 重定向用户到登录页面
10. WHEN 用户点击登出 THEN 系统 SHALL 清除 localStorage 中的认证信息并重定向到登录页面

### Requirement 2: 用户注册管理

**User Story:** 作为一个公司管理员，我希望能够为我的公司添加新用户，以便团队成员可以访问系统。

#### Acceptance Criteria

1. WHEN 管理员访问用户管理页面 THEN 系统 SHALL 显示"添加新用户"按钮
2. WHEN 管理员点击"添加新用户" THEN 系统 SHALL 显示用户注册表单，包含用户名和密码字段
3. WHEN 管理员提交用户注册表单 THEN 系统 SHALL 调用 `/api/user/register` 接口，传递当前 client_id
4. WHEN 用户注册成功 THEN 系统 SHALL 显示成功消息并刷新用户列表
5. WHEN 用户名已存在 THEN 系统 SHALL 显示错误消息"Username already exists"

### Requirement 3: 仪表盘数据展示

**User Story:** 作为一个用户，我希望在仪表盘上看到系统的关键指标和实时状态，以便快速了解系统运行情况。

#### Acceptance Criteria

1. WHEN 用户访问仪表盘 THEN 系统 SHALL 显示四个统计卡片：在线 Worker 数量、可用 Worker 数量、运行中任务数、今日完成任务数
2. WHEN 仪表盘加载 THEN 系统 SHALL 调用 `/api/workers/status/{client_id}` 获取 Worker 数据
3. WHEN 仪表盘加载 THEN 系统 SHALL 调用任务相关接口获取任务统计数据
4. WHEN Worker 数据返回 THEN 系统 SHALL 计算在线 Worker 数量（基于 last_heartbeat 时间）
5. WHEN Worker 数据返回 THEN 系统 SHALL 计算可用 Worker 数量（在线且未分配任务的 Worker）
6. WHEN 仪表盘显示 THEN 系统 SHALL 展示 Worker 资源使用趋势折线图（使用 Recharts）
7. WHEN 仪表盘显示 THEN 系统 SHALL 展示任务状态分布饼图（使用 Recharts）
8. WHEN 仪表盘显示 THEN 系统 SHALL 展示实时任务列表，包含任务 ID、Worker ID 和进度条
9. WHEN 用户在仪表盘停留 THEN 系统 SHALL 每 5 秒轮询一次更新数据
10. WHEN 统计卡片显示数值 THEN 系统 SHALL 使用绿色主题配色方案

### Requirement 4: Worker 管理与监控

**User Story:** 作为一个用户，我希望能够查看和监控所有 Worker 的状态和资源使用情况，以便了解计算资源的可用性。

#### Acceptance Criteria

1. WHEN 用户访问 Worker 列表页面 THEN 系统 SHALL 调用 `/api/workers/status/{client_id}` 获取 Worker 数据
2. WHEN Worker 数据返回 THEN 系统 SHALL 在表格中显示每个 Worker 的状态、ID、CPU 使用率、内存使用率、显存使用率
3. WHEN Worker 在线（last_heartbeat 在最近 30 秒内）THEN 系统 SHALL 显示绿色在线状态指示器
4. WHEN Worker 离线（last_heartbeat 超过 30 秒）THEN 系统 SHALL 显示灰色离线状态指示器
5. WHEN 显示资源使用率 THEN 系统 SHALL 使用进度条可视化展示百分比
6. WHEN CPU 使用率超过 80% THEN 系统 SHALL 将进度条显示为橙色警告色
7. WHEN 用户在搜索框输入 THEN 系统 SHALL 实时过滤 Worker 列表
8. WHEN 用户选择状态筛选器 THEN 系统 SHALL 只显示匹配状态的 Worker
9. WHEN 用户点击刷新按钮 THEN 系统 SHALL 重新获取 Worker 数据
10. WHEN 用户点击 Worker 详情按钮 THEN 系统 SHALL 导航到 Worker 详情页面
11. WHEN 用户访问 Worker 详情页面 THEN 系统 SHALL 显示 Worker 的基本信息（ID、CPU 核心数、CPU 频率、内存大小、显存大小）
12. WHEN Worker 详情页面显示 THEN 系统 SHALL 展示实时资源监控图表（CPU、内存、显存使用率随时间变化）
13. WHEN 用户在 Worker 详情页面停留 THEN 系统 SHALL 每 3 秒轮询一次更新资源数据

### Requirement 5: 文件管理

**User Story:** 作为一个用户，我希望能够上传 CSV 数据文件并管理我的文件，以便为计算任务提供数据输入。

#### Acceptance Criteria

1. WHEN 用户访问文件管理页面 THEN 系统 SHALL 显示文件上传组件和文件列表
2. WHEN 用户拖拽文件到上传区域 THEN 系统 SHALL 接受文件并准备上传
3. WHEN 用户点击上传区域 THEN 系统 SHALL 打开文件选择对话框
4. WHEN 用户选择非 CSV 文件 THEN 系统 SHALL 显示错误消息"Only CSV files are allowed"
5. WHEN 用户选择超过 100MB 的文件 THEN 系统 SHALL 显示错误消息"File size exceeds 100MB limit"
6. WHEN 用户上传有效的 CSV 文件 THEN 系统 SHALL 调用 `/api/file/upload` 接口，传递 client_id、user_id 和文件
7. WHEN 文件上传成功 THEN 系统 SHALL 显示成功消息并刷新文件列表
8. WHEN 文件上传失败 THEN 系统 SHALL 显示错误消息
9. WHEN 文件列表显示 THEN 系统 SHALL 展示文件名、文件大小、上传时间和操作按钮
10. WHEN 用户点击预览按钮 THEN 系统 SHALL 在模态框中显示 CSV 文件的前 100 行数据
11. WHEN 用户点击下载按钮 THEN 系统 SHALL 触发文件下载

### Requirement 6: 任务创建

**User Story:** 作为一个用户，我希望能够创建计算任务，以便在分布式系统上执行算法。

#### Acceptance Criteria

1. WHEN 用户访问任务创建页面 THEN 系统 SHALL 显示任务创建表单
2. WHEN 任务创建表单显示 THEN 系统 SHALL 提供算法选择下拉框（function_id）
3. WHEN 任务创建表单显示 THEN 系统 SHALL 显示最近上传的文件列表供用户选择
4. WHEN 任务创建表单显示 THEN 系统 SHALL 提供任务参数配置字段（task_volume）
5. WHEN 用户未选择文件 THEN 系统 SHALL 禁用提交按钮
6. WHEN 用户未选择算法 THEN 系统 SHALL 禁用提交按钮
7. WHEN 用户提交任务创建表单 THEN 系统 SHALL 调用 `/api/task/execute` 接口，传递 user_id 和 function_id
8. WHEN 任务创建成功 THEN 系统 SHALL 显示成功消息并返回 task_id
9. WHEN 任务创建成功 THEN 系统 SHALL 自动导航到任务详情页面
10. WHEN 没有可用 Worker THEN 系统 SHALL 显示错误消息"No available workers"
11. WHEN 用户没有上传文件 THEN 系统 SHALL 显示错误消息"No file found for user"

### Requirement 7: 任务列表与监控

**User Story:** 作为一个用户，我希望能够查看所有任务的状态并进行筛选，以便跟踪任务执行情况。

#### Acceptance Criteria

1. WHEN 用户访问任务列表页面 THEN 系统 SHALL 显示所有任务的表格
2. WHEN 任务列表显示 THEN 系统 SHALL 展示任务 ID、算法名称、状态、创建时间和操作按钮
3. WHEN 任务状态为 "running" THEN 系统 SHALL 显示蓝色处理中状态徽章
4. WHEN 任务状态为 "success" THEN 系统 SHALL 显示绿色成功状态徽章
5. WHEN 任务状态为 "failure" THEN 系统 SHALL 显示红色失败状态徽章
6. WHEN 用户选择状态筛选器 THEN 系统 SHALL 只显示匹配状态的任务
7. WHEN 用户在搜索框输入 THEN 系统 SHALL 实时过滤任务列表
8. WHEN 用户点击任务详情按钮 THEN 系统 SHALL 导航到任务详情页面
9. WHEN 用户在任务列表页面停留 THEN 系统 SHALL 每 5 秒轮询一次更新任务状态

### Requirement 8: 任务详情与进度跟踪

**User Story:** 作为一个用户，我希望能够查看任务的详细信息和实时进度，以便了解任务执行的具体情况。

#### Acceptance Criteria

1. WHEN 用户访问任务详情页面 THEN 系统 SHALL 调用 `/api/task/status/{task_id}` 获取任务详情
2. WHEN 任务详情返回 THEN 系统 SHALL 显示任务基本信息（任务 ID、算法、状态、创建时间、重试次数）
3. WHEN 任务详情返回 THEN 系统 SHALL 计算并显示整体进度百分比
4. WHEN 任务详情返回 THEN 系统 SHALL 显示子任务列表表格
5. WHEN 子任务列表显示 THEN 系统 SHALL 展示每个子任务的 ID、Worker ID、数据范围、状态和进度
6. WHEN 子任务状态为 "success" THEN 系统 SHALL 显示绿色完成图标和 100% 进度
7. WHEN 子任务状态为 "computing" THEN 系统 SHALL 显示蓝色计算中图标和当前进度百分比
8. WHEN 子任务状态为 "waiting" THEN 系统 SHALL 显示灰色等待图标和 0% 进度
9. WHEN 子任务状态为 "failure" THEN 系统 SHALL 显示红色失败图标和错误信息
10. WHEN 用户在任务详情页面停留 THEN 系统 SHALL 每 3 秒轮询一次更新任务状态
11. WHEN 任务状态为 "success" THEN 系统 SHALL 显示"下载结果"按钮
12. WHEN 用户点击"下载结果" THEN 系统 SHALL 触发结果文件下载
13. WHEN 任务状态为 "failure" THEN 系统 SHALL 显示"重试任务"按钮
14. WHEN 用户点击"重试任务" THEN 系统 SHALL 调用任务重试接口
15. WHEN 任务正在运行 THEN 系统 SHALL 显示"取消任务"按钮

### Requirement 9: 响应式布局与导航

**User Story:** 作为一个用户，我希望系统具有清晰的导航结构和响应式布局，以便在不同设备上都能良好使用。

#### Acceptance Criteria

1. WHEN 用户访问任何受保护页面 THEN 系统 SHALL 显示主布局，包含 Header、Sidebar 和 Main Content Area
2. WHEN Header 显示 THEN 系统 SHALL 使用深绿色背景（#389e0d）并显示 Logo、导航菜单和用户信息
3. WHEN Sidebar 显示 THEN 系统 SHALL 使用浅绿色背景（#f6ffed）并显示菜单项：仪表盘、Worker、文件、任务、设置
4. WHEN 用户点击 Sidebar 菜单项 THEN 系统 SHALL 导航到对应页面并高亮当前菜单项
5. WHEN Main Content Area 显示 THEN 系统 SHALL 使用白色/浅灰色背景并显示面包屑导航
6. WHEN 面包屑导航显示 THEN 系统 SHALL 反映当前页面的层级结构
7. WHEN 用户在移动设备访问 THEN 系统 SHALL 将 Sidebar 折叠为汉堡菜单
8. WHEN 用户点击汉堡菜单 THEN 系统 SHALL 展开 Sidebar 覆盖层

### Requirement 10: 绿色主题设计系统

**User Story:** 作为一个用户，我希望系统具有统一的绿色主题视觉风格，以便获得一致的用户体验。

#### Acceptance Criteria

1. WHEN 系统加载 THEN 系统 SHALL 应用 Ant Design 主题配置，使用主绿色（#52c41a）作为 colorPrimary
2. WHEN 按钮显示 THEN 系统 SHALL 使用绿色作为主要按钮颜色
3. WHEN 状态徽章显示成功状态 THEN 系统 SHALL 使用绿色（#52c41a）
4. WHEN 状态徽章显示警告状态 THEN 系统 SHALL 使用橙色（#faad14）
5. WHEN 状态徽章显示错误状态 THEN 系统 SHALL 使用红色（#f5222d）
6. WHEN 状态徽章显示处理中状态 THEN 系统 SHALL 使用青色（#13c2c2）
7. WHEN 进度条显示 THEN 系统 SHALL 使用绿色渐变效果
8. WHEN 图表显示 THEN 系统 SHALL 使用绿色系配色方案
9. WHEN 表格 Header 显示 THEN 系统 SHALL 使用极浅绿色背景（#f6ffed）和深绿色文字（#389e0d）
10. WHEN 卡片显示 THEN 系统 SHALL 使用浅绿色边框（#b7eb8f）

### Requirement 11: 错误处理与用户反馈

**User Story:** 作为一个用户，我希望系统能够清晰地显示错误信息和操作反馈，以便我了解操作结果。

#### Acceptance Criteria

1. WHEN API 请求失败 THEN 系统 SHALL 使用 Ant Design Message 组件显示错误消息
2. WHEN API 请求成功 THEN 系统 SHALL 使用 Ant Design Message 组件显示成功消息
3. WHEN 网络请求超时（10 秒）THEN 系统 SHALL 显示"Request timeout"错误消息
4. WHEN API 返回 401 状态码 THEN 系统 SHALL 清除认证信息并重定向到登录页面
5. WHEN API 返回 400 状态码 THEN 系统 SHALL 显示后端返回的具体错误消息
6. WHEN API 返回 500 状态码 THEN 系统 SHALL 显示"Server error, please try again later"
7. WHEN 表单验证失败 THEN 系统 SHALL 在对应字段下方显示验证错误消息
8. WHEN 用户执行长时间操作（如文件上传）THEN 系统 SHALL 显示加载指示器
9. WHEN 数据加载中 THEN 系统 SHALL 显示骨架屏或加载动画

### Requirement 12: 状态管理与数据持久化

**User Story:** 作为一个用户，我希望系统能够高效地管理应用状态并保持我的登录状态，以便获得流畅的使用体验。

#### Acceptance Criteria

1. WHEN 应用初始化 THEN 系统 SHALL 使用 Zustand 创建独立的 store：authStore、workerStore、taskStore、fileStore
2. WHEN 用户登录成功 THEN 系统 SHALL 将 token、client_id、user_id 和 username 存储在 authStore 和 localStorage
3. WHEN 应用刷新 THEN 系统 SHALL 从 localStorage 恢复认证状态到 authStore
4. WHEN Worker 数据更新 THEN 系统 SHALL 更新 workerStore 中的 workers 数组和统计数据
5. WHEN 任务数据更新 THEN 系统 SHALL 更新 taskStore 中的 tasks 数组和 currentTask
6. WHEN 文件上传成功 THEN 系统 SHALL 更新 fileStore 中的 files 数组
7. WHEN 用户登出 THEN 系统 SHALL 清除所有 store 的状态和 localStorage 数据

### Requirement 13: API 集成与请求拦截

**User Story:** 作为开发者，我希望系统能够统一管理 API 请求并自动处理认证，以便简化开发和维护。

#### Acceptance Criteria

1. WHEN 应用初始化 THEN 系统 SHALL 创建 Axios 实例，配置 baseURL 为 `http://localhost:8080/api` 和 timeout 为 10000ms
2. WHEN 发起 API 请求 THEN 系统 SHALL 通过请求拦截器自动添加 Authorization header，值为 `Bearer {token}`
3. WHEN token 不存在 THEN 系统 SHALL 跳过添加 Authorization header
4. WHEN API 响应返回 THEN 系统 SHALL 通过响应拦截器统一处理错误
5. WHEN 创建 clientService THEN 系统 SHALL 提供 register、registerUser 和 login 方法
6. WHEN 创建 workerService THEN 系统 SHALL 提供 getAll 和 getDetail 方法
7. WHEN 创建 taskService THEN 系统 SHALL 提供 execute、getStatus 和 getAll 方法
8. WHEN 创建 fileService THEN 系统 SHALL 提供 upload 和 getAll 方法
9. WHEN 调用 fileService.upload THEN 系统 SHALL 设置 Content-Type 为 multipart/form-data

### Requirement 14: 实时数据更新

**User Story:** 作为一个用户，我希望系统能够实时更新 Worker 状态和任务进度，以便我能够及时了解系统变化。

#### Acceptance Criteria

1. WHEN 用户在仪表盘页面 THEN 系统 SHALL 每 5 秒轮询一次调用 Worker 和任务状态接口
2. WHEN 用户在 Worker 列表页面 THEN 系统 SHALL 每 5 秒轮询一次调用 Worker 状态接口
3. WHEN 用户在 Worker 详情页面 THEN 系统 SHALL 每 3 秒轮询一次调用 Worker 详情接口
4. WHEN 用户在任务列表页面 THEN 系统 SHALL 每 5 秒轮询一次调用任务列表接口
5. WHEN 用户在任务详情页面 THEN 系统 SHALL 每 3 秒轮询一次调用任务状态接口
6. WHEN 用户离开页面 THEN 系统 SHALL 清除该页面的轮询定时器
7. WHEN 轮询请求失败 THEN 系统 SHALL 继续保持轮询但不显示错误消息（避免干扰用户）
8. WHEN 任务状态变为 "success" 或 "failure" THEN 系统 SHALL 停止该任务的轮询

### Requirement 15: 可访问性与用户体验

**User Story:** 作为一个用户，我希望系统具有良好的可访问性和用户体验，以便所有用户都能轻松使用。

#### Acceptance Criteria

1. WHEN 按钮显示 THEN 系统 SHALL 提供清晰的文本标签和适当的图标
2. WHEN 表单输入框显示 THEN 系统 SHALL 提供清晰的标签和占位符文本
3. WHEN 用户悬停在可交互元素上 THEN 系统 SHALL 显示鼠标指针变化和视觉反馈
4. WHEN 用户使用键盘导航 THEN 系统 SHALL 显示清晰的焦点指示器
5. WHEN 颜色用于传达信息 THEN 系统 SHALL 同时提供文本或图标作为辅助
6. WHEN 数据加载失败 THEN 系统 SHALL 提供重试按钮
7. WHEN 表格数据为空 THEN 系统 SHALL 显示友好的空状态提示
8. WHEN 用户执行危险操作（如删除）THEN 系统 SHALL 显示确认对话框
