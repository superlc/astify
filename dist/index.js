"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("@babel/parser");
var t = require("@babel/types");
// @ts-ignore
var traverse_1 = require("@babel/traverse");
var astify = function (literal) {
    if (literal === null) {
        return t.nullLiteral();
    }
    switch (typeof literal) {
        case 'function':
            var funcNode_1 = t.unaryExpression('void', t.numericLiteral(0), true);
            var ast = (0, parser_1.parse)(literal.toString(), {
                allowReturnOutsideFunction: true,
                allowSuperOutsideMethod: true,
            });
            (0, traverse_1.default)(ast, {
                // @ts-ignore
                'FunctionDeclaration|FunctionExpression|ArrowFunctionExpression': {
                    // 在exit时赋值，让最终为最外层的function
                    exit: function (path) {
                        funcNode_1 = path.node;
                        return;
                    },
                },
            });
            return funcNode_1;
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
            return t.objectExpression(Object.keys(literal)
                .filter(function (k) {
                // @ts-ignore
                return typeof literal[k] !== 'undefined';
            })
                .map(function (k) {
                // @ts-ignore
                return t.objectProperty(t.stringLiteral(k), astify(literal[k]));
            }));
    }
};
exports.default = astify;
//# sourceMappingURL=index.js.map