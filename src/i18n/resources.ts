import enUSCommon from './locales/en-US/common';
import enUSErrors from './locales/en-US/errors';
import enUSShell from './locales/en-US/shell';
import zhCNCommon from './locales/zh-CN/common';
import zhCNErrors from './locales/zh-CN/errors';
import zhCNShell from './locales/zh-CN/shell';

export const DEFAULT_LANGUAGE = 'zh-CN' as const;

export const SUPPORTED_LANGUAGES = ['zh-CN', 'en-US'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const I18N_NAMESPACES = {
  COMMON: 'common',
  SHELL: 'shell',
  ERRORS: 'errors',
} as const;

export type I18nNamespace = (typeof I18N_NAMESPACES)[keyof typeof I18N_NAMESPACES];

export const resources = {
  'zh-CN': {
    [I18N_NAMESPACES.COMMON]: zhCNCommon,
    [I18N_NAMESPACES.SHELL]: zhCNShell,
    [I18N_NAMESPACES.ERRORS]: zhCNErrors,
  },
  'en-US': {
    [I18N_NAMESPACES.COMMON]: enUSCommon,
    [I18N_NAMESPACES.SHELL]: enUSShell,
    [I18N_NAMESPACES.ERRORS]: enUSErrors,
  },
} as const;
