type ScoreButtonsProps = {
  options: readonly number[];
  selectedScore: number;
  disabled?: boolean;
  onSelect: (score: number) => void;
};

type ToggleButtonProps = {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
};

type ShowResultsButtonProps = {
  canShow: boolean;
  showResults: boolean;
  onShow: () => void;
  withDivider?: boolean;
};

export function ScoreButtons({
  options,
  selectedScore,
  disabled = false,
  onSelect,
}: ScoreButtonsProps) {
  return (
    <>
      {options.map((score) => (
        <button
          key={score}
          onClick={() => onSelect(score)}
          className={selectedScore === score ? 'selected' : ''}
          disabled={disabled}
        >
          {score}
        </button>
      ))}
    </>
  );
}

export function ToggleButton({
  label,
  selected,
  disabled = false,
  onClick,
}: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={selected ? 'selected' : ''}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export function ShowResultsButton({
  canShow,
  showResults,
  onShow,
  withDivider = true,
}: ShowResultsButtonProps) {
  if (!canShow) {
    return null;
  }

  return (
    <>
      {withDivider && <hr style={{ margin: '30px' }} />}
      {!showResults && (
        <div style={{ marginTop: '30px' }}>
          <button onClick={onShow}>結果を表示</button>
        </div>
      )}
    </>
  );
}
