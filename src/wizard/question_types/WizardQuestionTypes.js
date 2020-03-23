import GroupType from 'src/wizard/question_types/group_type/GroupType';
import TextType from 'src/wizard/question_types/text_type/TextType';
import NumericType from 'src/wizard/question_types/numeric_type/NumericType';
import SSNType from 'src/wizard/question_types/ssn_type/SSNType';
import EmailType from 'src/wizard/question_types/email_type/EmailType';
import TelephoneType from 'src/wizard/question_types/telephone_type/TelephoneType';
import SelectType from 'src/wizard/question_types/select_type/SelectType';
import ZipCodeType from 'src/wizard/question_types/zip_code_type/ZipCodeType';

export class WizardQuestionTypes {
  constructor(types) {
    this.types = types || {};
  }

  registerQuestionTypes(newTypes) {
    this.types = { ...this.types, ...newTypes };
  }

  unregisterQuestionType(typeName) {
    delete this.types[typeName];
  }

  getComponentForTypeName(typeName) {
    if(this.types[typeName]) {
      return this.types[typeName];
    } else {
      console.error(`Unregistered type name: ${typeName}. You must register custom question types.`);
    }
  }
}

const builtinTypes = {
  group: GroupType,
  text: TextType,
  numeric: NumericType,
  ssn: SSNType,
  email: EmailType,
  telephone: TelephoneType,
  select: SelectType,
  zipcode: ZipCodeType
};

export const builtinQuestionTypes = new WizardQuestionTypes(builtinTypes);

export default builtinQuestionTypes;
