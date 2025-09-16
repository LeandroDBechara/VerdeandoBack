import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'ValidarCuit', async: false })
export class ValidarCuit implements ValidatorConstraintInterface {
  validate(cuit: string, args: ValidationArguments) {
    if (!/^\d{11}$/.test(cuit)) return false;

    const coeficientes = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    const digitos = cuit.split('').map(d => parseInt(d, 10));

    const suma = coeficientes.reduce((acc, coef, i) => acc + coef * digitos[i], 0);
    const resto = suma % 11;
    const verificador = resto === 0 ? 0 : resto === 1 ? 9 : 11 - resto;

    return digitos[10] === verificador;
  }

  defaultMessage(args: ValidationArguments) {
    return 'El CUIL/CUIT ingresado tiene un dígito verificador inválido';
  }
}
