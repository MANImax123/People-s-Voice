// Mock database for development - replace with actual database connection
export const techsDB: any[] = [];

export function addTech(tech: any) {
  techsDB.push(tech);
  return tech;
}

export function findTechByEmail(email: string) {
  return techsDB.find(tech => tech.email === email);
}

export function getAllTechs() {
  return techsDB;
}
