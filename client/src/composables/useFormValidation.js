import { reactive } from 'vue';

const trimValue = (value) => (typeof value === 'string' ? value.trim() : value);

export const validators = {
  required: (label) => (value) => {
    const normalized = trimValue(value);
    if (normalized === '' || normalized === null || normalized === undefined) {
      return `${label}不能为空`;
    }
    return '';
  },
  minLength: (label, length) => (value) => {
    if (String(trimValue(value) || '').length < length) {
      return `${label}至少${length}个字符`;
    }
    return '';
  },
  maxLength: (label, length) => (value) => {
    if (String(trimValue(value) || '').length > length) {
      return `${label}不能超过${length}个字符`;
    }
    return '';
  },
  email: (label = '邮箱') => (value) => {
    const normalized = trimValue(value);
    if (!normalized) return '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return `${label}格式不正确`;
    }
    return '';
  },
  phone: (label = '电话') => (value) => {
    const normalized = trimValue(value);
    if (!normalized) return '';
    if (!/^1\d{10}$/.test(normalized) && !/^\d{7,15}$/.test(normalized)) {
      return `${label}格式不正确`;
    }
    return '';
  },
  number: (label) => (value) => {
    if (value === '' || value === null || value === undefined) return '';
    if (Number.isNaN(Number(value))) {
      return `${label}必须是数字`;
    }
    return '';
  },
  integer: (label) => (value) => {
    if (value === '' || value === null || value === undefined) return '';
    if (!Number.isInteger(Number(value))) {
      return `${label}必须是整数`;
    }
    return '';
  },
  min: (label, minValue) => (value) => {
    if (value === '' || value === null || value === undefined) return '';
    if (Number(value) < minValue) {
      return `${label}不能小于${minValue}`;
    }
    return '';
  },
  max: (label, maxValue) => (value) => {
    if (value === '' || value === null || value === undefined) return '';
    if (Number(value) > maxValue) {
      return `${label}不能大于${maxValue}`;
    }
    return '';
  },
  url: (label = '链接') => (value) => {
    const normalized = trimValue(value);
    if (!normalized) return '';
    if (!/^https?:\/\/.+/i.test(normalized)) {
      return `${label}必须以 http:// 或 https:// 开头`;
    }
    return '';
  }
};

export function useFormValidation(form, rules) {
  const errors = reactive({});

  const validateField = (field) => {
    const validatorsForField = rules[field] || [];
    const value = form[field];

    for (const validator of validatorsForField) {
      const message = validator(value, form);
      if (message) {
        errors[field] = message;
        return false;
      }
    }

    errors[field] = '';
    return true;
  };

  const validateForm = () => {
    let valid = true;
    Object.keys(rules).forEach((field) => {
      if (!validateField(field)) valid = false;
    });
    return valid;
  };

  const clearError = (field) => {
    errors[field] = '';
  };

  const resetErrors = () => {
    Object.keys(rules).forEach((field) => {
      errors[field] = '';
    });
  };

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    resetErrors
  };
}
