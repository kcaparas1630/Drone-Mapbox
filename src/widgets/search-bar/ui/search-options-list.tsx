// Listbox of search suggestions or recent places; options keep input focus so a click never blurs first.
import type { SearchOption } from '../model/search.schema';

export type SearchOptionsListProps = {
  listId: string;
  options: SearchOption[];
  activeIndex: number;
  emptyMessage: string;
  onChoose: (option: SearchOption) => void;
};

// Renders the options as an ARIA listbox, or a short message when there are none.
export function SearchOptionsList({
  listId,
  options,
  activeIndex,
  emptyMessage,
  onChoose,
}: SearchOptionsListProps) {
  if (options.length === 0) {
    return (
      <p className="mt-1 rounded-panel border border-panel-border bg-panel px-3 py-2 text-sm text-muted-foreground backdrop-blur-md">
        {emptyMessage}
      </p>
    );
  }
  return (
    <ul
      id={listId}
      role="listbox"
      aria-label="Places"
      className="mt-1 max-h-72 overflow-y-auto rounded-panel border border-panel-border bg-panel py-1 shadow-lg backdrop-blur-md"
    >
      {options.map((option, index) => (
        <li
          key={option.id}
          id={`${listId}-${String(index)}`}
          role="option"
          aria-selected={index === activeIndex}
          className={`flex min-h-11 cursor-pointer flex-col justify-center px-3 py-1.5 ${index === activeIndex ? 'bg-muted' : 'hover:bg-muted'}`}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={() => {
            onChoose(option);
          }}
        >
          <span className="truncate text-sm font-medium">{option.name}</span>
          {option.detail === '' ? null : (
            <span className="truncate text-xs text-muted-foreground">{option.detail}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
