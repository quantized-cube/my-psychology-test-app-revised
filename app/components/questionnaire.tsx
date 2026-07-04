import type { ReactNode } from 'react';

type ScoreButtonsProps = {
  options: readonly number[];
  selectedScore: number;
  disabled?: boolean;
  questionIndex: number;
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
  questionIndex,
  onSelect,
}: ScoreButtonsProps) {
  return (
    <>
      {options.map((score) => (
        <button
          key={score}
          type="button"
          onClick={() => onSelect(score)}
          className={`score-button${selectedScore === score ? ' selected' : ''}`}
          disabled={disabled}
          role="radio"
          aria-checked={selectedScore === score}
          aria-label={`${questionIndex + 1}問目: ${score}`}
        >
          {score}
        </button>
      ))}
    </>
  );
}

function QuestionHeading({
  id,
  level,
  children,
}: {
  id?: string;
  level: 2 | 3;
  children: ReactNode;
}) {
  return level === 2 ? <h2 id={id}>{children}</h2> : <h3 id={id}>{children}</h3>;
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
  const answeredCount = scores.filter((score) => score !== 0).length;
  const firstUnansweredIndex = scores.findIndex((score) => score === 0);
  const hasUnanswered = firstUnansweredIndex !== -1;
  const questionCount = questions.length;

  const handleJumpToUnanswered = () => {
    if (!hasUnanswered || typeof document === 'undefined') {
      return;
    }

    document
      .getElementById(`question-${firstUnansweredIndex + 1}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      <div className="questionnaire-progress" aria-live="polite">
        <span>
          回答済み {answeredCount} / {questionCount}
        </span>
        {!disabled && hasUnanswered && (
          <button
            type="button"
            className="command-button"
            onClick={handleJumpToUnanswered}
          >
            未回答へ移動
          </button>
        )}
      </div>
      {questions.map((question, index) => (
        <section
          key={index}
          id={`question-${index + 1}`}
          className="question-item"
        >
          {renderBeforeQuestion?.(index)}
          <QuestionHeading
            id={`question-${index + 1}-label`}
            level={questionHeadingLevel}
          >
            {index + 1}.{' '}
            {question}
          </QuestionHeading>
          <div
            className="score-button-group"
            role="radiogroup"
            aria-labelledby={`question-${index + 1}-label`}
          >
            <ScoreButtons
              options={scoreOptions}
              selectedScore={scores[index]}
              questionIndex={index}
              onSelect={(score) => onAnswer(index, score)}
              disabled={disabled}
            />
          </div>
          {renderAfterScoreButtons?.(index)}
        </section>
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
      type="button"
      onClick={onClick}
      className={`toggle-button${selected ? ' selected' : ''}`}
      disabled={disabled}
      aria-pressed={selected}
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
  const handleShow = () => {
    onShow();
    window.setTimeout(() => {
      document
        .getElementById('results')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  if (!canShow) {
    return null;
  }

  return (
    <>
      {withDivider && <hr style={{ margin: '30px' }} />}
      {!showResults && (
        <div className="show-results">
          <button
            type="button"
            className="command-button primary"
            onClick={handleShow}
          >
            結果を表示
          </button>
        </div>
      )}
    </>
  );
}
