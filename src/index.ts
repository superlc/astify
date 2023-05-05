import { parse as babelParse } from '@babel/parser';
import * as t from '@babel/types';
// @ts-ignore
import traverse from '@babel/traverse';

const astify = (literal: null | number | string | boolean | Array<any> | object): any => {
    if (literal === null) {
        return t.nullLiteral();
    }
    switch (typeof literal) {
        case 'function':
            let funcNode = t.unaryExpression('void', t.numericLiteral(0), true);
            const ast = babelParse(literal.toString(), {
                allowReturnOutsideFunction: true,
                allowSuperOutsideMethod: true,
            });
            traverse(ast, {
                // @ts-ignore
                'FunctionDeclaration|FunctionExpression|ArrowFunctionExpression': {
                    // 在exit时赋值，让最终为最外层的function
                    exit: (path: any) => {
                        funcNode = path.node;
                        return;
                    },
                },
            });
            return funcNode;
        case 'number':
            return t.numericLiteral(literal);
        case 'string':
            return t.stringLiteral(literal);
        case 'boolean':
            return t.booleanLiteral(literal);
        case 'undefined':
            return t.unaryExpression('void', t.numericLiteral(0), true);
        default:
            if (Array.isArray(literal)) {
                return t.arrayExpression(literal.map(astify));
            }
            return t.objectExpression(
                Object.keys(literal)
                    .filter((k) => {
                        // @ts-ignore
                        return typeof literal[k] !== 'undefined';
                    })
                    .map((k) => {
                        // @ts-ignore
                        return t.objectProperty(t.stringLiteral(k), astify(literal[k]));
                    })
            );
    }
};

export default astify;