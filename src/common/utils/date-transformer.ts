export function transformDateString(value: any, fieldName: string,hour?: number, minute?: number, second?: number, millisecond?: number): Date {
    if (!value) return null as any; // or throw an error if null dates aren't allowed
    
    // Si ya es un objeto Date, retornarlo directamente
    if (value instanceof Date) {
      return value;
    }
    
    // Si no es un string, convertirlo a string
    const stringValue = String(value);
    
    // Verificar si el formato es DD-MM-YYYY
    const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = stringValue.match(dateRegex);
    
    if (match) {
      const [, day, month, year] = match; // Usar destructuring con coma para omitir el primer elemento
      console.log( 'day: ', day);
      console.log( 'month: ', month);
      console.log( 'year: ', year);
      const now = new Date();
      const date = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        hour || now.getHours(),
        minute || now.getMinutes(),
        second || now.getSeconds(),
        millisecond || now.getMilliseconds(),
      );
      if (isNaN(date.getTime())) {
        throw new Error(`${fieldName} debe ser una fecha válida`);
      }
      return date;
    }
    
    // Fallback para otros formatos de fecha
    const date = new Date(stringValue);
    if (isNaN(date.getTime())) {
      throw new Error(`${fieldName} debe ser una fecha válida en formato DD-MM-YYYY`);
    }
    return date;
}