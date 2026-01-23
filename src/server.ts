import { buildApp } from "./app";
const app = buildApp();

app.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
    }
    console.log(`Server is running on ${address}`);
}); 