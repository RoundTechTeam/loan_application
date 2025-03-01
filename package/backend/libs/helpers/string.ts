import ShortUniqueId from 'short-unique-id';

function randomString(
  length: number,
  config?: { includeSpecialCase: boolean },
) {
  let result = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  if (config?.includeSpecialCase) {
    characters = `${characters}!@#$%^&*)(+=._-`;
  }
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function uuid(length = 10): string {
  return new ShortUniqueId({ length: length })();
}

const filter = {
  alphabetOnly(word: string) {
    return word.replace(/[^a-zA-Z]/g, '');
  },
  alphaNumeric(word: string) {
    return word.replace(/[^a-zA-Z0-9]/g, '');
  },
  numericOnly(word: string) {
    return word.replace(/[^0-9]/g, '');
  },
};

function slugify(v: string) {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export { filter, randomString, slugify, uuid };
