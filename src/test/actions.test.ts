import { makeActions } from '../actions';

import { blogActionCreators, blogActionTypes } from './test-cases/blog';

describe('actions', () => {
  describe('makeActions', () => {
    describe('add', () => {
      test('basic', () => {
        const result = blogActionCreators.add('author', 'a1');
        expect(result).toEqual({
          type: blogActionTypes.ADD,
          entity: 'author',
          id: 'a1',
        });
      });

      test('advanced', () => {
        const result = blogActionCreators.add(
          'author',
          'a1',
          [
            {
              rel: 'articleIds',
              id: 'r1'
            },
            {
              rel: 'articleIds',
              id: 'r1',
              index: 1,
              reciprocalIndex: 2,
              options: { createNonexistent: true }
            }
          ],
          { ifExists: 'patch' }
        );

        const expected = {
          type: blogActionTypes.ADD,
          entity: 'author',
          id: 'a1',
          attach: [
            {
              rel: 'articleIds',
              id: 'r1'
            },
            {
              rel: 'articleIds',
              id: 'r1',
              index: 1,
              reciprocalIndex: 2,
              options: { createNonexistent: true }
            }
          ],
          options: { ifExists: 'patch' },
        };

        expect(result).toEqual(expected);
      });
    });
  });
});