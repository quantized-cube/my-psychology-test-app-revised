import { useId } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

type ScoreButtonsProps = {
  idPrefix: string;
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
  idPrefix?: string;
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
  idPrefix,
  options,
  selectedScore,
  disabled = false,
  questionIndex,
  onSelect,
}: ScoreButtonsProps) {
  const focusScoreButton = (score: number) => {
    window.setTimeout(() => {
      document
        .getElementById(`${idPrefix}-question-${questionIndex + 1}-score-${score}`)
        ?.focus();
    }, 0);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    optionIndex: number,
  ) => {
    const keyToIndex: Record<string, number> = {
      ArrowDown: (optionIndex + 1) % options.length,
      ArrowRight: (optionIndex + 1) % options.length,
      ArrowUp: (optionIndex - 1 + options.length) % options.length,
      ArrowLeft: (optionIndex - 1 + options.length) % options.length,
      Home: 0,
      End: options.length - 1,
    };

    const nextIndex = keyToIndex[event.key];

    if (nextIndex === undefined) {
      return;
    }

    event.preventDefault();
    const nextScore = options[nextIndex];
    onSelect(nextScore);
    focusScoreButton(nextScore);
  };

  return (
    <>
      {options.map((score, optionIndex) => (
        <button
          key={score}
          id={`${idPrefix}-question-${questionIndex + 1}-score-${score}`}
          type="button"
          onClick={() => onSelect(score)}
          onKeyDown={(event) => handleKeyDown(event, optionIndex)}
          className={`score-button${selectedScore === score ? ' selected' : ''}`}
          disabled={disabled}
          role="radio"
          aria-checked={selectedScore === score}
          aria-label={`${questionIndex + 1}問目: ${score}`}
          tabIndex={selectedScore === score || (selectedScore === 0 && optionIndex === 0) ? 0 : -1}
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
  idPrefix,
  questions,
  scores,
  scoreOptions,
  disabled = false,
  questionHeadingLevel = 3,
  onAnswer,
  renderBeforeQuestion,
  renderAfterScoreButtons,
}: QuestionListProps) {
  const reactId = useId().replace(/:/g, '');
  const uniqueIdPrefix = idPrefix ?? `questionnaire-${reactId}`;
  const answeredCount = scores.filter((score) => score !== 0).length;
  const firstUnansweredIndex = scores.findIndex((score) => score === 0);
  const hasUnanswered = firstUnansweredIndex !== -1;
  const questionCount = questions.length;

  const handleJumpToUnanswered = () => {
    if (!hasUnanswered || typeof document === 'undefined') {
      return;
    }

    const unansweredQuestionId = `${uniqueIdPrefix}-question-${firstUnansweredIndex + 1}`;
    const firstScoreButtonId = `${unansweredQuestionId}-score-${scoreOptions[0]}`;

    document
      .getElementById(unansweredQuestionId)
      ?.scrollIntoView({
        behavior: getScrollBehavior(),
        block: 'center',
      });
    window.setTimeout(() => {
      document.getElementById(firstScoreButtonId)?.focus();
    }, 0);
  };

  return (
    <div className="questionnaire-list">
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
          id={`${uniqueIdPrefix}-question-${index + 1}`}
          className="question-item"
        >
          {renderBeforeQuestion?.(index)}
          <QuestionHeading
            id={`${uniqueIdPrefix}-question-${index + 1}-label`}
            level={questionHeadingLevel}
          >
            {index + 1}.{' '}
            {question}
          </QuestionHeading>
          <div
            className="score-button-group"
            data-score-count={scoreOptions.length}
            role="radiogroup"
            aria-labelledby={`${uniqueIdPrefix}-question-${index + 1}-label`}
          >
            <ScoreButtons
              idPrefix={uniqueIdPrefix}
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
    </div>
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
      const results = document.getElementById('results');
      results?.scrollIntoView({
        behavior: getScrollBehavior(),
        block: 'start',
      });
      results?.focus({ preventScroll: true });
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

function getScrollBehavior(): ScrollBehavior {
  if (
    typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return 'auto';
  }

  return 'smooth';
}
