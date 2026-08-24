export function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]) {
  return inputs
    .flat()
    .filter(Boolean)
    .map(x => {
      if (typeof x === 'object' && x !== null) {
        return Object.entries(x)
          .filter(([_, val]) => Boolean(val))
          .map(([key]) => key)
          .join(' ');
      }
      return x;
    })
    .join(' ');
}
