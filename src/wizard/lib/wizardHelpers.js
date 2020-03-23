import Evaluator from 'src/Evaluator';

export const calculationsForValues = (calculationSet, values) => {
  const evaluator = new Evaluator();
  const calculations = {};
  const variables = { ...values };

  for(const calculation of calculationSet) {
    evaluator.expression = calculation.condition;
    evaluator.updateVariables(variables);
    const shouldApply = evaluator.eval(false);

    if(shouldApply) {
      evaluator.expression = calculation.expression;
      calculations[calculation.name] = variables[calculation.name] = evaluator.eval();
    }
  }

  return calculations;
};

export const questionIsQualified = (question, context, values, calculations, debug) => {
  if(question.context & context) {
    const evaluator = new Evaluator(null, { ...values, ...calculations });
    evaluator.expression = question.condition;
    if(!question.condition || evaluator.eval(false)) {
      if(debug) {
        console.log(`WIZARD: Found [${sectionIndex}][${questionIndex}] (${question.name}) - [Context: ${question.context}] [Condition: "${question.condition}"]`, values);
      }
      return true;
    } else if(debug) {
      console.log(`WIZARD: Skipping [${sectionIndex}][${questionIndex}] (${question.name}) - Expression did not eval to truthy value: ["${question.condition}"]`, values);
    }
  } else if(debug) {
    console.log(`WIZARD: Skipping [${sectionIndex}][${questionIndex}] (${question.name}) - Context did not match [${question.context} & ${context}]`);
  }

  return false;
};

export const nextIndices = (questions, context, currSectionIndex, currQuestionIndex, values, calculations, debug) => {
  if(debug) { console.log(`WIZARD: Searching for next indices...`, currSectionIndex, currQuestionIndex); }

  // Outer loop iterates through the sections
  let numSections = questions.length;
  for(let sectionIndex = currSectionIndex; sectionIndex < numSections; sectionIndex++) {
    const activeSection = questions[sectionIndex];
    // Inner loop iterates through the questions
    const numQuestions = activeSection.questions.length;
    for(let questionIndex = sectionIndex == currSectionIndex && currQuestionIndex != null ? currQuestionIndex + 1 : 0; questionIndex < numQuestions; questionIndex++) {
      const activeQuestion = activeSection.questions[questionIndex];
      // Check for display qualification

      if(questionIsQualified(activeQuestion, context, values, calculations, debug)) {
        return [sectionIndex, questionIndex];
      }
    }
  }

  // If we fall through to here, then there is no next question and the wizard is done
  if(debug) { console.log(`WIZARD: No more qualified questions.`); }
  return [null, null];
};
