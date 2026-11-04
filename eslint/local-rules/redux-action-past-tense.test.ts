// Tests that createSlice reducer names must be past-tense events.
import { createRuleTester } from './create-rule-tester';
import { reduxActionPastTense } from './redux-action-past-tense';

const ruleTester = createRuleTester();
const IMPORT = "import { createSlice } from '@reduxjs/toolkit';\n";

ruleTester.run('redux-action-past-tense', reduxActionPastTense, {
  valid: [
    `${IMPORT}createSlice({ reducers: { routePlanned() {}, routeCleared() {}, droneSnapshotPublished() {} } });`,
    `${IMPORT}createSlice({ reducers: { followDistanceChanged() {}, fireDeselected() {}, contextLost() {} } });`,
    `${IMPORT}createSlice({ reducers: (create) => ({ recentPlaceAdded: create.reducer(() => {}) }) });`,
    "import { createSlice as makeSlice } from '@reduxjs/toolkit';\nmakeSlice({ reducers: { arrivalDismissed() {} } });",
    "import { createSlice } from './local';\ncreateSlice({ reducers: { reset() {} } });",
    {
      code: `${IMPORT}createSlice({ reducers: { hydrate() {} } });`,
      options: [{ allow: ['hydrate'] }],
    },
  ],
  invalid: [
    {
      code: `${IMPORT}createSlice({ reducers: { reset() {} } });`,
      errors: [{ messageId: 'notPastTense' }],
    },
    {
      code: `${IMPORT}createSlice({ reducers: { clear() {} } });`,
      errors: [{ messageId: 'notPastTense' }],
    },
    {
      code: `${IMPORT}createSlice({ reducers: { setMode() {}, routeReset() {} } });`,
      errors: [{ messageId: 'notPastTense' }, { messageId: 'notPastTense' }],
    },
    {
      code: "import * as toolkit from '@reduxjs/toolkit';\ntoolkit.createSlice({ reducers: { toggle() {} } });",
      errors: [{ messageId: 'notPastTense' }],
    },
    {
      code: `${IMPORT}createSlice({ reducers: (create) => { return { update: create.reducer(() => {}) }; } });`,
      errors: [{ messageId: 'notPastTense' }],
    },
  ],
});
