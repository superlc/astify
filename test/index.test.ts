import { describe, expect, test } from '@jest/globals';
import astify from '../src/index';
import * as t from '@babel/types';

describe('string', () => {
    test('astify("cluo") equal t.stringLiteral("cluo")', () => {
        expect(astify('cluo')).toEqual(t.stringLiteral('cluo'));
    })
});
