export interface PlaceText {
  position?: number;
  text: string;
}

const CHARACTERS_WIDTH = 27;
const DEFAULT_POSITION = 3;

interface GetBoxRowProps {
  placeText?: PlaceText;
  first?: boolean;
  last?: boolean;
  charactersWidth?: number;
  startSpace?: boolean;
}

const getBoxRow = ({
  placeText,
  first,
  last,
  charactersWidth = CHARACTERS_WIDTH,
  startSpace = true,
}: GetBoxRowProps) => {
  const charAt = (index: number, textToPlace?: string) => {
    if (startSpace && (index === 0 || index === charactersWidth - (textToPlace ? textToPlace.length - 1 : 0) - 1))
      return first ? ' ' : '|';

    return first || last ? '_' : ' ';
  };

  if (!placeText) return Array.from({ length: charactersWidth }).map((_, i) => charAt(i));
  const { position, text } = placeText;
  const textPosition = position ?? DEFAULT_POSITION;

  return Array.from({ length: charactersWidth - text.length + 1 }).map((_, i) =>
    i === textPosition ? text : charAt(i, text),
  );
};

export default getBoxRow;
