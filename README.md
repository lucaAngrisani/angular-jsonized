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
  models: Model[];
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

export type Input<T = any> = {
  name: string;
  type: string;
  importTypeUrl: string;
  initialValue: T;
  required: boolean;
  alias: string;
};

export type Output = {
  name: string;
  type: string;
  importTypeUrl: string;
  alias: string;
};

export type Model<T = any> = {
  name: string;
  type: string;
  importTypeUrl: string;
  initialValue: T;
  required: boolean;
  alias: string;
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
          "importTypeUrl": "",
          "initialValue": "",
          "required": true,
          "alias": "exInput"
        }
      ],
      "outputs": [
        {
          "name": "exampleOutput",
          "type": "EventEmitter<any>",
          "importTypeUrl": "@angular/core",
          "alias": "exOutput"
        }
      ],
      "models": [],
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

1. Add globally the custom CLI:

   ```
   npm install -g angular-jsonized
   ```

## Usage

1. Go to the desired directory of the project:

   ```
   cd <your-location>
   ```

2. Run the script with correct JSON file configuration:
   ```
   ngjson -g <your-json-conf-file-location>
   ```

### Options

- `--help`: Show help
- `--version`: Show the current version of the CLI

## Usage Example

Assuming you have a JSON configuration file called `config.json` in the current directory, run:

```
ngjson -g config.json
```

## Contributions

Contributions are welcome! Please open an issue or a pull request in the repository.

## License

This project is licensed under the ISC License.
