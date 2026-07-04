import type { ReactNode } from 'react';

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

type QuestionListProps = {
  questions: readonly string[];
  scores: readonly number[];
  scoreOptions: readonly number[];
  disabled?: boolean;
  questionHeadingLevel?: 2 | 3;
  onAnswer: (index: number, score: number) => void;
  renderBeforeQuestion?: (index: number) => ReactNode;
  renderAfterScoreButtons?: (index: number) => ReactNode;
};

type GroupedQuestionListProps = Omit<QuestionListProps, 'renderBeforeQuestion'> & {
  groupStarts: readonly number[];
  groupLabels: readonly string[];
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

function QuestionHeading({
  level,
  children,
}: {
  level: 2 | 3;
  children: ReactNode;
}) {
  return level === 2 ? <h2>{children}</h2> : <h3>{children}</h3>;
}

export function QuestionList({
  questions,
  scores,
  scoreOptions,
  disabled = false,
  questionHeadingLevel = 3,
  onAnswer,
  renderBeforeQuestion,
  renderAfterScoreButtons,
}: QuestionListProps) {
  return (
    <>
      {questions.map((question, index) => (
        <div key={index}>
          {renderBeforeQuestion?.(index)}
          <QuestionHeading level={questionHeadingLevel}>
            {question}
          </QuestionHeading>
          <ScoreButtons
            options={scoreOptions}
            selectedScore={scores[index]}
            onSelect={(score) => onAnswer(index, score)}
            disabled={disabled}
          />
          {renderAfterScoreButtons?.(index)}
        </div>
      ))}
    </>
  );
}

export function GroupedQuestionList({
  groupStarts,
  groupLabels,
  ...questionListProps
}: GroupedQuestionListProps) {
  return (
    <QuestionList
      {...questionListProps}
      renderBeforeQuestion={(index) => {
        const groupIndex = groupStarts.indexOf(index);

        if (groupIndex === -1) {
          return null;
        }

        return (
          <>
            <hr style={{ margin: '30px' }} />
            <h2>{groupLabels[groupIndex]}</h2>
          </>
        );
      }}
    />
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
