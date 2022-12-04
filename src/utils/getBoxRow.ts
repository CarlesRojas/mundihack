export interface PlaceText {
  position?: number;
  text: string;
}

const CHARACTERS_WIDTH = 25;
const DEFAULT_POSITION = 3;

const getBoxRow = ({ placeText, first, last }: { placeText?: PlaceText; first?: boolean; last?: boolean }) => {
  const charAt = (index: number, textToPlace?: string) => {
    if (index === 0 || index === CHARACTERS_WIDTH - (textToPlace ? textToPlace.length - 1 : 0) - 1)
      return first ? ' ' : '|';

    return first || last ? '_' : ' ';
  };

  if (!placeText) return Array.from({ length: CHARACTERS_WIDTH }).map((_, i) => charAt(i));
  const { position, text } = placeText;
  const textPosition = position ?? DEFAULT_POSITION;

  return Array.from({ length: CHARACTERS_WIDTH - text.length + 1 }).map((_, i) =>
    i === textPosition ? text : charAt(i, text),
  );
};

export default getBoxRow;
