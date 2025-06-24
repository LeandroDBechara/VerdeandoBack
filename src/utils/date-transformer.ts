export function transformDateString(value: string, fieldName: string): Date {
    if (!value) return null as any; // or throw an error if null dates aren't allowed    
    // Verificar si el formato es DD-MM-YYYY
    const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = value.match(dateRegex);
    
    if (match) {
      const [, day, month, year] = match;
      
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0);
      if (isNaN(date.getTime())) {
        throw new Error(`${fieldName} debe ser una fecha válida`);
      }
      return date;
    }
    
    // Fallback para otros formatos de fecha
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error(`${fieldName} debe ser una fecha válida en formato DD-MM-YYYY`);
    }
    return date;
}