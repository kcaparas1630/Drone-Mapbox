// Shapes for request budgets: the limits one API gets and the answer to "may these requests go out?" (ADR 025).

export type RequestBudgetLimits = { perMinute: number; perDay: number };

export type RequestBudgetDecision =
  { isAllowed: true } | { isAllowed: false; exceededWindow: 'minute' | 'day' };

export type RequestBudget = {
  // Sets room aside for `count` requests (default 1) when both windows have it; otherwise sets nothing aside.
  reserve: (count?: number) => RequestBudgetDecision;
};
