import * as util from '../util';
import { TSESTree } from '@typescript-eslint/experimental-utils';

export default util.createRule({
  name: 'no-unsafe-call',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallows calling an any type value',
      category: 'Possible Errors',
      recommended: false,
      requiresTypeChecking: true,
    },
    messages: {
      unsafeCall: 'Unsafe call of an any typed value',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { program, esTreeNodeToTSNodeMap } = util.getParserServices(context);
    const checker = program.getTypeChecker();

    return {
      'CallExpression, OptionalCallExpression'(
        node: TSESTree.CallExpression | TSESTree.OptionalCallExpression,
      ): void {
        const tsNode = esTreeNodeToTSNodeMap.get(node.callee);
        if (util.isAnyType(tsNode, checker)) {
          context.report({
            node: node.callee,
            messageId: 'unsafeCall',
          });
        }
      },
    };
  },
});
