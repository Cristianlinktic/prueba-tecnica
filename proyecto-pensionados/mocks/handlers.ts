import { http, HttpResponse } from "msw";

let user = {
  id: "1",
  name: "Felipe Sabogal",
  email: "cristian.sabogal@linktic.com",
  createdAt: "2024-01-01T12:00:00Z",
};

export const handlers = [
  // Login
  http.post("/users/login", async ({ request }) => {
    const { email, password } = await request.json() as any;
    if (email === "cristian.sabogal@linktic.com" && password === "password") {
      const accessToken = "mock-access-token";
      const refreshToken = "mock-refresh-token";

      return HttpResponse.json(
        { accessToken, user },
        {
          status: 200,
          headers: {
            "Set-Cookie": `accessToken=${accessToken}; Path=/; SameSite=Strict`,
          },
        }
      );
    }
    return HttpResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
  }),

  http.post("/users/refresh", async ({ cookies }) => {
    if (cookies["refreshToken"] === "mock-refresh-token") {
      return HttpResponse.json({ accessToken: "new-mock-access-token" });
    }
    return new HttpResponse(null, { status: 401 });
  }),

  // Obtener perfil
  http.get("/users/me", () => {
    return HttpResponse.json(user);
  }),

  // Editar perfil
  http.put("/users/me", async ({ request }) => {
    const body = await request.json() as any;

    // Solo permitimos actualizar el nombre
    if (body.name && typeof body.name === "string") {
      user = { ...user, name: body.name };
      return HttpResponse.json(user);
    }

    return HttpResponse.json({ message: "Nombre inválido" }, { status: 400 });
  }),
];
