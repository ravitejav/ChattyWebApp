import { FormControl } from '@angular/forms';

export class CustomErrorMessage {
  constructor() {}

  getErrors(form: FormControl, formControlName: string) {
    return form.get(formControlName).errors;
  }

  getMessage(form: FormControl, formControlName: string, name: string = "") {
    const errors = this.getErrors(form, formControlName);
    return errors ? this.getErrorMessage(errors, name) : null;
  }

  getErrorMessage(errors, name: string) {
    let errorMessage = "Something looks not right";
    let error = '';
    Object.keys(errors).length === 0 ? errorMessage = '' : error = Object.keys(errors)[0];
    switch(error) {
      case 'required':
        return "Required field";
      case 'minlength':
        return `${name} should be atleast ${errors.minlength.requiredLength} character`;
      case 'maxlength':
        return `${name} should not exceed ${errors.maxlength.requiredLength} charaters`;
      case 'email':
        return `Please enter valid Email`;
      case 'pattern':
        return `Please enter valid input`
    }
    return errorMessage;
  }

}
