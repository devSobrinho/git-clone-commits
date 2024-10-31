const generationText = (length: number) => {
  return Array.from({ length })
    .map(() => {
      return Math.random().toString(36).substring(2);
    })
    .join("")
    .substring(0, length);
};

export const generation = {
  text: generationText,
};
