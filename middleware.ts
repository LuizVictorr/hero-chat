import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define as rotas protegidas
const isProtectedRoute = createRouteMatcher(['/home(.*)']);

export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) {
        auth().protect();
    }
});

export const config = {
    matcher: [
        // Exclui arquivos estáticos e rotas internas do Next.js
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Aplica o middleware sempre para as rotas de API
        '/(api|trpc)(.*)',
    ],
};
