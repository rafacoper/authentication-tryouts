const ROLE = {
  ADMIN: "admin",
  BASIC: "basic",
};

export const data = {
  ROLE: ROLE,
  users: [
    {
      id: 1,
      firstName: "Rafael",
      email: "rafa@email.com",
      password: "12345678",
      role: ROLE.ADMIN,
    },
    {
      id: 2,
      firstName: "Caia",
      email: "caia@email.com",
      password: "12345678",
      role: ROLE.BASIC,
    },
    {
      id: 3,
      firstName: "Stella",
      email: "stella@email.com",
      password: "12345678",
      role: ROLE.BASIC,
    },
  ],
  projects: [
    { id: 1, projectName: "Rafa's Project", userId: 1 },
    { id: 2, projectName: "Caia's Project", userId: 2 },
    { id: 3, projectName: "Stella's Project", userId: 3 },
  ],
};
