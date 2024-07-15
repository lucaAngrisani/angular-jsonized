export type Structure = {
    components: Component[];
    services: Service[];
    pipes: Pipe[];
    directives: Directive[];
}

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
}

export type Service = Elem & {
    providedInRoot: boolean;
}

export type Pipe = Elem & {
    standalone: boolean;
}

export type Directive = Elem & {
    standalone: boolean;
    selector: string;
}

export type Input = {
    name: string;
    type: string;
    importTypeUrl: string;
    required: boolean;
    alias: string;
    transform: Function;
}

export type Output = {
    name: string;
    type: string;
    importTypeUrl: string;
    alias: string;
}

export type Model = {
    name: string;
    type: string;
    importTypeUrl: string;
}

type Elem = {
    name: string;
    path: string;
    dirPath: string;
}
