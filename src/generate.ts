import { createDir, createFile, writeFile } from "./dir-manager";
import { Component, Directive, Pipe, Service, Structure } from "./structure.type";

export const generate = (file: Structure) => {
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
    const componentPathName = component.name?.trim().toLowerCase()?.replace(' ', '-');

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

    const content = `
import { Component${component.inputs?.length ? `, input` : ''}${component.outputs?.length ? `, output` : ''} } from '@angular/core';
${[...innerComponents?.map(comp => `import { ${getComponentName(comp.name)} } from './${comp.dirPath}'`),
        ...innerServices?.filter(service => !service?.providedInRoot)?.map(serv => `import { ${getServiceName(serv.name)} } from './${serv.dirPath}'`),
        ...innerPipes?.filter(pipe => pipe?.standalone)?.map(pipe => `import { ${getPipeName(pipe.name)} } from './${pipe.dirPath}'`),
        ...innerDirectives?.filter(directive => directive?.standalone)?.map(directive => `import { ${getDirectiveName(directive.name)} } from './${directive.dirPath}'`),
        ...component.inputs?.filter(input => input.importTypeUrl)?.map(input => `import { ${getDirectiveName(input.name)} } from '${input.importTypeUrl}'`),
        ...component.outputs?.filter(output => output.importTypeUrl)?.map(output => `import { ${getDirectiveName(output.name)} } from '${output.importTypeUrl}'`)
        ]?.join(';\n')}

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
                ...innerComponents?.map(comp => `${getComponentName(comp.name)}`),
                ...innerPipes?.filter(pipe => pipe?.standalone)?.map(pipe => `${getPipeName(pipe.name)}`),
                ...innerDirectives?.filter(directive => directive?.standalone)?.map(directive => `${getDirectiveName(directive.name)}`)
            ]?.join(',\n\t\t')}
    ]` : '[]'},
})
${component.defaultExport ? 'export default' : 'export'} class ${getComponentName(component.name)} {
    ${[
            ...component.inputs?.map(input => `${input.name} = input<${input.type}>()`),
            ...component.outputs?.map(output => `${output.name} = output<${output.type}>()`)
        ].join(';\n')}\n\tconstructor() {}
}`;

    const templateContent: string = `
<p>${component.selector} works!</p> ${component.components ? `\n\n${component.components?.map(comp => `<${comp.selector}></${comp.selector}>`).join('\n')}` : ''}
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
    constructor() {}
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