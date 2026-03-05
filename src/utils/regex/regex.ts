const REGEX_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9_%+-]+(\.[a-zA-Z0-9_%+-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[\sA-Za-z\d@$!%*?&]{6,}$/,
  // URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  
};

export const validate = {
  email: (value: string) => REGEX_PATTERNS.EMAIL.test(value),
  password: (value: string) => REGEX_PATTERNS.PASSWORD_STRONG.test(value),
  // url: (value: string) => REGEX_PATTERNS.URL.test(value),
};