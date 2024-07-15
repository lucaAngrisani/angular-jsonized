"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const dir_manager_1 = require("./dir-manager");
const generate = (file) => {
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
exports.generate = generate;
function generateComponent(component, parentPath = '') {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const componentPathName = (_b = (_a = component.name) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) === null || _b === void 0 ? void 0 : _b.replace(' ', '-');
    const dirPath = `${componentPathName}`;
    (0, dir_manager_1.createDir)(`${parentPath}${dirPath}`);
    component.dirPath = `${dirPath}/${componentPathName}.component`;
    component.path = `${componentPathName}.component.ts`;
    component.templateUrl = `${componentPathName}.component.html`;
    component.styleUrls = [`${componentPathName}.component.css`];
    const innerComponents = [];
    if (component.components) {
        for (const innerComponent of component.components) {
            innerComponents.push(generateComponent(innerComponent, `${parentPath}${dirPath}/`));
        }
    }
    const innerServices = [];
    if (component.services) {
        for (const innerService of component.services) {
            innerServices.push(generateService(innerService, `${parentPath}${dirPath}/`));
        }
    }
    const innerPipes = [];
    if (component.pipes) {
        for (const innerPipe of component.pipes) {
            innerPipes.push(generatePipe(innerPipe, `${parentPath}${dirPath}/`));
        }
    }
    const innerDirectives = [];
    if (component.directives) {
        for (const innerDirective of component.directives) {
            innerDirectives.push(generateDirective(innerDirective, `${parentPath}${dirPath}/`));
        }
    }
    component.standalone = (_c = component.standalone) !== null && _c !== void 0 ? _c : true;
    component.defaultExport = !!component.defaultExport;
    component.selector = (_d = component.selector) !== null && _d !== void 0 ? _d : 'app-' + componentPathName;
    const content = `
import { Component } from '@angular/core';
${(_h = [...innerComponents === null || innerComponents === void 0 ? void 0 : innerComponents.map(comp => `import { ${getComponentName(comp.name)} } from './${comp.dirPath}'`),
        ...(_e = innerServices === null || innerServices === void 0 ? void 0 : innerServices.filter(service => !(service === null || service === void 0 ? void 0 : service.providedInRoot))) === null || _e === void 0 ? void 0 : _e.map(serv => `import { ${getServiceName(serv.name)} } from './${serv.dirPath}'`),
        ...(_f = innerPipes === null || innerPipes === void 0 ? void 0 : innerPipes.filter(pipe => pipe === null || pipe === void 0 ? void 0 : pipe.standalone)) === null || _f === void 0 ? void 0 : _f.map(pipe => `import { ${getPipeName(pipe.name)} } from './${pipe.dirPath}'`),
        ...(_g = innerDirectives === null || innerDirectives === void 0 ? void 0 : innerDirectives.filter(directive => directive === null || directive === void 0 ? void 0 : directive.standalone)) === null || _g === void 0 ? void 0 : _g.map(directive => `import { ${getDirectiveName(directive.name)} } from './${directive.dirPath}'`),
    ]) === null || _h === void 0 ? void 0 : _h.join(';\n')}

@Component({
    standalone: ${component.standalone},
    selector: '${component.selector}',
    templateUrl: './${component.templateUrl}',
    styleUrls: [${(_k = (_j = component.styleUrls) === null || _j === void 0 ? void 0 : _j.map(url => `'./${url}'`)) === null || _k === void 0 ? void 0 : _k.join(',')}],
    providers: ${(innerServices === null || innerServices === void 0 ? void 0 : innerServices.length) ? `[
        ${(_m = (_l = innerServices === null || innerServices === void 0 ? void 0 : innerServices.filter(service => !(service === null || service === void 0 ? void 0 : service.providedInRoot))) === null || _l === void 0 ? void 0 : _l.map(service => `${getServiceName(service.name)}`)) === null || _m === void 0 ? void 0 : _m.join(',\n\t\t')}
    ]` : '[]'},
    imports: ${(innerComponents === null || innerComponents === void 0 ? void 0 : innerComponents.length) || (innerPipes === null || innerPipes === void 0 ? void 0 : innerPipes.length) || (innerDirectives === null || innerDirectives === void 0 ? void 0 : innerDirectives.length) ? `[
        ${(_q = [
        ...innerComponents === null || innerComponents === void 0 ? void 0 : innerComponents.map(comp => `${getComponentName(comp.name)}`),
        ...(_o = innerPipes === null || innerPipes === void 0 ? void 0 : innerPipes.filter(pipe => pipe === null || pipe === void 0 ? void 0 : pipe.standalone)) === null || _o === void 0 ? void 0 : _o.map(pipe => `${getPipeName(pipe.name)}`),
        ...(_p = innerDirectives === null || innerDirectives === void 0 ? void 0 : innerDirectives.filter(directive => directive === null || directive === void 0 ? void 0 : directive.standalone)) === null || _p === void 0 ? void 0 : _p.map(directive => `${getDirectiveName(directive.name)}`)
    ]) === null || _q === void 0 ? void 0 : _q.join(',\n\t\t')}
    ]` : '[]'},
})
${component.defaultExport ? 'export default' : 'export'} class ${getComponentName(component.name)} {
    constructor() {}
}`;
    const templateContent = `
<p>${component.selector} works!</p> ${component.components ? `\n\n${(_r = component.components) === null || _r === void 0 ? void 0 : _r.map(comp => `<${comp.selector}></${comp.selector}>`).join('\n')}` : ''}
`;
    try {
        (0, dir_manager_1.createFile)(`${parentPath}${dirPath}/${component.styleUrls[0]}`);
        (0, dir_manager_1.writeFile)(`${parentPath}${dirPath}/${component.path}`, content);
        (0, dir_manager_1.writeFile)(`${parentPath}${dirPath}/${component.templateUrl}`, templateContent);
        console.log(`✅ ${getComponentName(component.name)}`);
    }
    catch (err) {
        console.log(`❌ ${getComponentName(component.name)} - ${err}`);
    }
    return component;
}
function generateService(service, parentPath = '') {
    var _a, _b;
    const servicePathName = (_b = (_a = service.name) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) === null || _b === void 0 ? void 0 : _b.replace(' ', '-');
    const dirPath = `services`;
    (0, dir_manager_1.createDir)(`${parentPath}${dirPath}`);
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
        (0, dir_manager_1.writeFile)(`${parentPath}${dirPath}/${service.path}`, content);
        console.log(`✅ ${getServiceName(service.name)}`);
    }
    catch (err) {
        console.log(`❌ ${getServiceName(service.name)} - ${err}`);
    }
    return service;
}
function generatePipe(pipe, parentPath = '') {
    var _a, _b, _c;
    const pipePathName = (_b = (_a = pipe.name) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) === null || _b === void 0 ? void 0 : _b.replace(' ', '-');
    const dirPath = `pipes`;
    (0, dir_manager_1.createDir)(`${parentPath}${dirPath}`);
    pipe.path = `${pipePathName}.pipe.ts`;
    pipe.standalone = (_c = pipe.standalone) !== null && _c !== void 0 ? _c : true;
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
        (0, dir_manager_1.writeFile)(`${parentPath}${dirPath}/${pipe.path}`, content);
        console.log(`✅ ${getPipeName(pipe.name)}`);
    }
    catch (err) {
        console.log(`❌ ${getPipeName(pipe.name)} - ${err}`);
    }
    return pipe;
}
function generateDirective(directive, parentPath = '') {
    var _a, _b, _c, _d;
    const directivePathName = (_b = (_a = directive.name) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) === null || _b === void 0 ? void 0 : _b.replace(' ', '-');
    const dirPath = `directives`;
    (0, dir_manager_1.createDir)(`${parentPath}${dirPath}`);
    directive.path = `${directivePathName}.directive.ts`;
    directive.standalone = (_c = directive.standalone) !== null && _c !== void 0 ? _c : true;
    directive.selector = (_d = directive.selector) !== null && _d !== void 0 ? _d : `[${getCamelCaseName(directive.name)}]`;
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
        (0, dir_manager_1.writeFile)(`${parentPath}${dirPath}/${directive.path}`, content);
        console.log(`✅ ${getDirectiveName(directive.name)}`);
    }
    catch (err) {
        console.log(`❌ ${getDirectiveName(directive.name)} - ${err}`);
    }
    return directive;
}
function getComponentName(name) {
    return getName(name, 'Component');
}
function getServiceName(name) {
    return getName(name, 'Service');
}
function getPipeName(name) {
    return getName(name, 'Pipe');
}
function getDirectiveName(name) {
    return getName(name, 'Directive');
}
function getName(name, specificName) {
    return `${name === null || name === void 0 ? void 0 : name.replace(' ', '')}${(name === null || name === void 0 ? void 0 : name.endsWith(specificName)) ? '' : specificName}`;
}
function getCamelCaseName(name) {
    return name.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}
//# sourceMappingURL=generate.js.map