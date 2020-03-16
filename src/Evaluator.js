export default class Evaluator {
  constructor(expression, variables) {
    this.expression = expression;
    this.variables = { ...variables };
    if(this.variables) {
      this.updateNamesAndValues();
    }
  }

  eval(onErrVal) {
    onErrVal = typeof onErrVal == null ? null : onErrVal;
    try {
      return (new Function(...this.names, `return ${this.expression};`))(...this.values);
    } catch(error) {
      return onErrVal;
    }
  }

  updateVariables(variables) {
    this.variables = { ...this.variables, ...variables };
    this.updateNamesAndValues();
  }

  updateNamesAndValues() {
    this.names = Object.keys(this.variables);
    this.values = this.names.map(varName => this.variables[varName]);
  }
}
