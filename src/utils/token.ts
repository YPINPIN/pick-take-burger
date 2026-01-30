export const getToken = () => {
  return document.cookie.replace(/(?:(?:^|.*;\s*)ptBurgerToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
};

export const setToken = (token: string, expired: number) => {
  document.cookie = `ptBurgerToken=${token};expires=${new Date(expired)};`;
};

export const clearToken = () => {
  document.cookie = 'ptBurgerToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;';
};
