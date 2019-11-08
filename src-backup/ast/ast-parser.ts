import * as ts from 'typescript';

class AstParser {
  sourceFile: ts.SourceFile;
  rootNode: ts.Node;
  printMatch: RegExp;

  constructor(code, printMatches?) {
    printMatches = printMatches || ['SyntaxList', 'Statement', 'Declaration', 'DeclarationList', 'Block'];
    this.printMatch = new RegExp(`/(${this.printMatches.join('|')})$/`);
    this.sourceFile = ts.createSourceFile('AstParser Class', '' + code, ts.ScriptTarget.Latest);
    this.rootNode = this.sourceFile;
  }

  getData(node?) {
    node = node || this.rootNode;
    const syntaxKind = ts.SyntaxKind[node.kind];
    const nodeText = node.getText(this.sourceFile);
    const children = node.getChildren(this.sourceFile);

    return {node, syntaxKind, nodeText, children};
  }

  printSummary(node = this.rootNode, indentLevel = 0) {
    const indentation = '-'.repeat(indentLevel);
    const syntaxKind = ts.SyntaxKind[node.kind];
    const nodeText = node.getText(this.sourceFile).replace(/\s+/g,' ');
    if (syntaxKind.match(this.printMatch)) {
      console.log(`${indentation} ${syntaxKind}: ${nodeText}`);
    }

    node.getChildren(this.sourceFile).forEach(child => {
      this.printSummary(child, indentLevel+1);
    });
  }

}

/* tslint:disable */
function myFunc(foo, bar) {
  const hello = this.hello;
  this.foo = this.bar;
  const test: number = 1 + 2;
  const myVar = {};
  for(var key in this.obj) {
    myVar[key] = this.foo.bar;
    myVar[key] = this.obj[key];
  }
}
/* tslint:enable */

// console.log('' + myFunc);
// const parser = new AstParser(myFunc);
// console.log(parser.printSummary())

