console.log("Hello from TypeScript!");

// Example TypeScript function
function greet(name: string): string {
    return `Hello, ${name}! Welcome to Hyperkit!`;
}

// Example usage
const message = greet("Developer");
console.log(message);

// Example interface
interface Project {
    name: string;
    version: string;
    description: string;
}

const project: Project = {
    name: "Hyperkit",
    version: "1.0.0",
    description: "A TypeScript and Hardhat project"
};

console.log(`Project: ${project.name} v${project.version}`);
console.log(`Description: ${project.description}`); 