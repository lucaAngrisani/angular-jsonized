# Angular Component Generator CLI

## Description

This custom CLI generates Angular components, services, pipes, and directives based on a JSON configuration file. The goal is to facilitate the creation of Angular projects following a predefined structure.

## Configuration File Format

The JSON configuration file must follow the structure described below:

```typescript
export type Structure = {
  components: Component[];
  services: Service[];
  pipes: Pipe[];
  directives: Directive[];
};

export type Component = Elem & {
  defaultExport: boolean;
  selector: string;
  standalone: boolean;
  components: Component[];
  inputs: Input[];
  outputs: Output[];
  services: Service[];
  pipes: Pipe[];
  directives: Directive[];
  dirPath: string;
  path: string;
  templateUrl: string;
  styleUrls: string[];
};

export type Service = Elem & {
  providedInRoot: boolean;
};

export type Pipe = Elem & {
  standalone: boolean;
};

export type Directive = Elem & {
  standalone: boolean;
  selector: string;
};

export type Input = {
  name: string;
  type: string;
  importTypeUrl: string;
};

export type Output = {
  name: string;
  type: string;
  importTypeUrl: string;
};

type Elem = {
  name: string;
  path: string;
  dirPath: string;
};
```

### Example Configuration JSON File

```json
{
  "components": [
    {
      "name": "ExampleComponent",
      "defaultExport": true,
      "selector": "app-example",
      "standalone": false,
      "components": [],
      "inputs": [
        {
          "name": "exampleInput",
          "type": "string",
          "importTypeUrl": ""
        }
      ],
      "outputs": [
        {
          "name": "exampleOutput",
          "type": "EventEmitter<any>",
          "importTypeUrl": "@angular/core"
        }
      ],
      "services": [],
      "pipes": [],
      "directives": [],
      "dirPath": "src/app/components",
      "path": "example.component.ts",
      "templateUrl": "./example.component.html",
      "styleUrls": ["./example.component.css"]
    }
  ],
  "services": [
    {
      "name": "ExampleService",
      "providedInRoot": true,
      "path": "src/app/services/example.service.ts",
      "dirPath": "src/app/services"
    }
  ],
  "pipes": [],
  "directives": []
}
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/angular-component-generator-cli.git
   ```

2. Navigate to the project directory:

   ```bash
   cd angular-component-generator-cli
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Build the project:
   ```bash
   npm run build
   ```

## Usage

Run the CLI with the JSON configuration file as an argument:

```bash
node dist/index.js path/to/configuration.json
```

### Options

- `--help`: Show help
- `--version`: Show the current version of the CLI

## Usage Example

Assuming you have a JSON configuration file called `config.json` in the current directory, run:

```bash
node dist/index.js config.json
```

## Contributions

Contributions are welcome! Please open an issue or a pull request in the repository.

## License

This project is licensed under the ISC License.
