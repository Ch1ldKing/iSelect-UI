import type { ThemeConfig } from 'antd';

// Green theme configuration for Ant Design
export const greenTheme: ThemeConfig = {
  token: {
    colorPrimary: '#52c41a',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#13c2c2',
    colorLink: '#52c41a',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  },
  components: {
    Button: {
      colorPrimary: '#52c41a',
      algorithm: true,
    },
    Table: {
      headerBg: '#f6ffed',
      headerColor: '#389e0d',
    },
    Card: {
      colorBorderSecondary: '#b7eb8f',
    },
    Progress: {
      defaultColor: '#52c41a',
    },
    Layout: {
      headerBg: '#389e0d',
      siderBg: '#f6ffed',
    },
  },
};
