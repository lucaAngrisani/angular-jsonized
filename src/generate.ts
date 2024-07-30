import { createDir, createFile, writeFile } from "./dir-manager";
import { Component, Directive, Input, Model, Output, Pipe, Service, Structure } from "./structure.type";

export const generate = (file: Structure) => {

    console.log('\nSTART GENERATING\n');

    for (const component of file.components) {
        generateComponent(component);
    }

    for (const service of file.services) {
        generateService(service);
    }

    for (const pipe of file.pipes) {
        generatePipe(pipe);
    }

    for (const directive of file.directives) {
        generateDirective(directive);
    }
};

function generateComponent(component: Component, parentPath: string = ''): Component {
    const componentPathName = component.name?.trim().replace(/[A-Z]/g, m => "-" + m.toLowerCase())?.replace(' ', '-');

    const dirPath = `${componentPathName}`;
    createDir(`${parentPath}${dirPath}`);

    component.dirPath = `${dirPath}/${componentPathName}.component`;
    component.path = `${componentPathName}.component.ts`;
    component.templateUrl = `${componentPathName}.component.html`;
    component.styleUrls = [`${componentPathName}.component.css`];

    const innerComponents: Component[] = [];
    if (component.components) {
        for (const innerComponent of component.components) {
            innerComponents.push(generateComponent(innerComponent, `${parentPath}${dirPath}/`));
        }
    }

    const innerServices: Service[] = [];
    if (component.services) {
        for (const innerService of component.services) {
            innerServices.push(generateService(innerService, `${parentPath}${dirPath}/`));
        }
    }

    const innerPipes: Pipe[] = [];
    if (component.pipes) {
        for (const innerPipe of component.pipes) {
            innerPipes.push(generatePipe(innerPipe, `${parentPath}${dirPath}/`));
        }
    }

    const innerDirectives: Directive[] = [];
    if (component.directives) {
        for (const innerDirective of component.directives) {
            innerDirectives.push(generateDirective(innerDirective, `${parentPath}${dirPath}/`));
        }
    }

    component.standalone = component.standalone ?? true;
    component.defaultExport = !!component.defaultExport;
    component.selector = component.selector ?? 'app-' + componentPathName;

    const innerInputs: Input[] = innerComponents?.filter(comp => comp.inputs?.length)?.map(comp => comp.inputs)?.reduce((acc, curr) => acc = acc.concat(curr), []);
    const innerOutputs: Output[] = innerComponents?.filter(comp => comp.outputs?.length)?.map(comp => comp.outputs)?.reduce((acc, curr) => acc = acc.concat(curr), []);
    const innerModels: Model[] = innerComponents?.filter(comp => comp.models?.length)?.map(comp => comp.models)?.reduce((acc, curr) => acc = acc.concat(curr), []);

    const content: string = `
import { Component${component.inputs?.length ? `, input` : ''}${component.models?.length ? `, model` : ''}${component.outputs?.length ? `, output` : ''}${innerModels?.length ? `, signal` : ''} } from '@angular/core';
${[...new Set([...innerComponents?.map(comp => `import { ${getComponentName(comp.name)} } from './${comp.dirPath}';`) ?? [],
    ...innerServices?.filter(service => !service?.providedInRoot)?.map(serv => `import { ${getServiceName(serv.name)} } from './${serv.dirPath}';`) ?? [],
    ...innerPipes?.filter(pipe => pipe?.standalone)?.map(pipe => `import { ${getPipeName(pipe.name)} } from './${pipe.dirPath}';`) ?? [],
    ...innerDirectives?.filter(directive => directive?.standalone)?.map(directive => `import { ${getDirectiveName(directive.name)} } from './${directive.dirPath}';`) ?? [],
    ...component.inputs?.filter(input => input?.importTypeUrl)?.map(input => `import { ${input.type.substring(0, input.type.indexOf('<') ? input.type.indexOf('<') : input.type.length)} } from '${input.importTypeUrl}';`) ?? [],
    ...component.outputs?.filter(output => output?.importTypeUrl)?.map(output => `import { ${output.type.substring(0, output.type.indexOf('<') ? output.type.indexOf('<') : output.type.length)} } from '${output.importTypeUrl}';`) ?? [],
    ...component.models?.filter(model => model?.importTypeUrl)?.map(model => `import { ${model.type.substring(0, model.type.indexOf('<') ? model.type.indexOf('<') : model.type.length)} } from '${model.importTypeUrl}';`) ?? [],
    ...innerInputs?.filter(input => input?.importTypeUrl)?.map(input => `import { ${input.type.substring(0, input.type.indexOf('<') ? input.type.indexOf('<') : input.type.length)} } from '${input.importTypeUrl}';`) ?? [],
    ...innerOutputs?.filter(output => output?.importTypeUrl)?.map(output => `import { ${output.type.substring(0, output.type.indexOf('<') ? output.type.indexOf('<') : output.type.length)} } from '${output.importTypeUrl}';`) ?? [],
    ...innerModels?.filter(model => model?.importTypeUrl)?.map(model => `import { ${model.type.substring(0, model.type.indexOf('<') ? model.type.indexOf('<') : model.type.length)} } from '${model.importTypeUrl}';`) ?? []
    ])]?.join('\n')}

@Component({
    standalone: ${component.standalone},
    selector: '${component.selector}',
    templateUrl: './${component.templateUrl}',
    styleUrls: [${component.styleUrls?.map(url => `'./${url}'`)?.join(',')}],
    providers: ${innerServices?.length ? `[
        ${innerServices?.filter(service => !service?.providedInRoot)?.map(service => `${getServiceName(service.name)}`)?.join(',\n\t\t')}
    ]` : '[]'},
    imports: ${innerComponents?.length || innerPipes?.length || innerDirectives?.length ? `[
        ${[
                ...innerComponents?.map(comp => `${getComponentName(comp.name)},`) ?? [],
                ...innerPipes?.filter(pipe => pipe?.standalone)?.map(pipe => `${getPipeName(pipe.name)},`) ?? [],
                ...innerDirectives?.filter(directive => directive?.standalone)?.map(directive => `${getDirectiveName(directive.name)},`) ?? []
            ]?.join('\n\t\t')}
    ]` : '[]'},
})
${component.defaultExport ? 'export default' : 'export'} class ${getComponentName(component.name)} {
    ${[
            ...innerInputs?.map(innerInput => `${innerInput.name}${(innerInput.initialValue != null || innerInput.initialValue != undefined) ? ` = ${JSON.stringify(innerInput.initialValue)}` : `!: ${innerInput.type}`};`) ?? [],
            ...innerModels?.map(innerModel => `${innerModel.name} = signal<${innerModel.type}>(${(innerModel.initialValue != null || innerModel.initialValue != undefined) ? JSON.stringify(innerModel.initialValue) : ''});`) ?? [],
            ...component.inputs?.map(input => `${input.name} = input${input.required ? '.required' : ''}<${input.type}>(${(input.initialValue != null || input.initialValue != undefined) ? JSON.stringify(input.initialValue) : ''}${input.alias ? `, { alias: '${input.alias}' }` : ''});`) ?? [],
            ...component.outputs?.map(output => `${output.name} = output<${output.type}>();`) ?? [],
            ...component.models?.map(model => `${model.name} = model${model.required ? '.required' : ''}<${model.type}>(${(model.initialValue != null || model.initialValue != undefined) ? JSON.stringify(model.initialValue) : ''}${model.alias ? `, { alias: '${model.alias}' }` : ''});`) ?? []
        ].reduce((acc, curr) => acc += curr + '\n\t', '')}\n\tconstructor() { }${innerOutputs.length ? '\n' : ''}
    ${[
            ...innerOutputs?.map(innerOutput => `${innerOutput.name}Change(event: ${innerOutput.type ?? 'any'}) { throw Error('Implement method') }`) ?? []
        ].join('\n\t')}
}`;

    const templateContent: string = `
<p>${component.selector} works!</p> ${component.components ? `\n\n${component.components?.map(comp => `<${comp.selector} ${[
        ...comp.inputs?.map(input => `[${input.alias ?? input.name}]="${input.name}"`) ?? [],
        ...comp.outputs?.map(output => `(${output.alias ?? output.name})="${output.name}Change($event)"`) ?? [],
        ...comp.models?.map(model => `[(${model.alias ?? model.name})]="${model.name}"`) ?? [],
    ].join('\n\t')}></${comp.selector}>`).join('\n')}` : ''}
`;

    try {
        createFile(`${parentPath}${dirPath}/${component.styleUrls[0]}`);
        writeFile(`${parentPath}${dirPath}/${component.path}`, content);
        writeFile(`${parentPath}${dirPath}/${component.templateUrl}`, templateContent);

        console.log(`✅ ${getComponentName(component.name)}`);
    } catch (err) {
        console.log(`❌ ${getComponentName(component.name)} - ${err}`);
    }

    return component;
}

function generateService(service: Service, parentPath: string = ''): Service {
    const servicePathName = service.name?.trim().toLowerCase()?.replace(' ', '-');

    const dirPath = `services`;
    createDir(`${parentPath}${dirPath}`);

    service.path = `${servicePathName}.service.ts`;
    service.dirPath = `${dirPath}/${servicePathName}.service`;
    service.providedInRoot = !!service.providedInRoot;

    const content = `
import { Injectable } from '@angular/core';

@Injectable(${service.providedInRoot ? `{
    providedIn: 'root'
}` : ''})
export class ${getServiceName(service.name)} {
    constructor() { }
}`;

    try {
        writeFile(`${parentPath}${dirPath}/${service.path}`, content);

        console.log(`✅ ${getServiceName(service.name)}`);
    } catch (err) {
        console.log(`❌ ${getServiceName(service.name)} - ${err}`);
    }

    return service;
}

function generatePipe(pipe: Pipe, parentPath: string = ''): Pipe {
    const pipePathName = pipe.name?.trim().toLowerCase()?.replace(' ', '-');

    const dirPath = `pipes`;
    createDir(`${parentPath}${dirPath}`);

    pipe.path = `${pipePathName}.pipe.ts`;
    pipe.standalone = pipe.standalone ?? true;
    pipe.dirPath = `${dirPath}/${pipePathName}.pipe`;

    const content = `
import { Pipe } from '@angular/core';

@Pipe({
    standalone: ${pipe.standalone},
    name: '${getCamelCaseName(pipe.name)}',
})
export class ${getPipeName(pipe.name)} {
    transform(value: any): string {
        return '';
    }
}`;

    try {
        writeFile(`${parentPath}${dirPath}/${pipe.path}`, content);

        console.log(`✅ ${getPipeName(pipe.name)}`);
    } catch (err) {
        console.log(`❌ ${getPipeName(pipe.name)} - ${err}`);
    }

    return pipe;
}

function generateDirective(directive: Directive, parentPath: string = ''): Directive {
    const directivePathName = directive.name?.trim().toLowerCase()?.replace(' ', '-');

    const dirPath = `directives`;
    createDir(`${parentPath}${dirPath}`);

    directive.path = `${directivePathName}.directive.ts`;
    directive.standalone = directive.standalone ?? true;
    directive.selector = directive.selector ?? `[${getCamelCaseName(directive.name)}]`;
    directive.dirPath = `${dirPath}/${directivePathName}.directive`;

    const content = `
import { Directive } from '@angular/core';

@Directive({
    standalone: ${directive.standalone},
    selector: '${directive.selector}',
})
export class ${getDirectiveName(directive.name)} {
}`;

    try {
        writeFile(`${parentPath}${dirPath}/${directive.path}`, content);

        console.log(`✅ ${getDirectiveName(directive.name)}`);
    } catch (err) {
        console.log(`❌ ${getDirectiveName(directive.name)} - ${err}`);
    }

    return directive;
}

function getComponentName(name: string): string {
    return getName(name, 'Component');
}

function getServiceName(name: string): string {
    return getName(name, 'Service');
}

function getPipeName(name: string): string {
    return getName(name, 'Pipe');
}

function getDirectiveName(name: string): string {
    return getName(name, 'Directive');
}

function getName(name: string, specificName: string): string {
    return `${name?.replace(' ', '')}${name?.endsWith(specificName) ? '' : specificName}`;
}

function getCamelCaseName(name: string): string {
    return name.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}