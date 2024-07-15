"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const dir_manager_1 = require("./dir-manager");
const generate = (file) => {
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
exports.generate = generate;
function generateComponent(component, parentPath = '') {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31;
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
    const innerInputs = (_f = (_e = innerComponents === null || innerComponents === void 0 ? void 0 : innerComponents.filter(comp => { var _a; return (_a = comp.inputs) === null || _a === void 0 ? void 0 : _a.length; })) === null || _e === void 0 ? void 0 : _e.map(comp => comp.inputs)) === null || _f === void 0 ? void 0 : _f.reduce((acc, curr) => acc = acc.concat(curr), []);
    const innerOutputs = (_h = (_g = innerComponents === null || innerComponents === void 0 ? void 0 : innerComponents.filter(comp => { var _a; return (_a = comp.outputs) === null || _a === void 0 ? void 0 : _a.length; })) === null || _g === void 0 ? void 0 : _g.map(comp => comp.outputs)) === null || _h === void 0 ? void 0 : _h.reduce((acc, curr) => acc = acc.concat(curr), []);
    const innerModels = (_k = (_j = innerComponents === null || innerComponents === void 0 ? void 0 : innerComponents.filter(comp => { var _a; return (_a = comp.models) === null || _a === void 0 ? void 0 : _a.length; })) === null || _j === void 0 ? void 0 : _j.map(comp => comp.models)) === null || _k === void 0 ? void 0 : _k.reduce((acc, curr) => acc = acc.concat(curr), []);
    const content = `
import { Component${((_l = component.inputs) === null || _l === void 0 ? void 0 : _l.length) ? `, input` : ''}${((_m = component.models) === null || _m === void 0 ? void 0 : _m.length) ? `, model` : ''}${((_o = component.outputs) === null || _o === void 0 ? void 0 : _o.length) ? `, output` : ''}${(innerModels === null || innerModels === void 0 ? void 0 : innerModels.length) ? `, signal` : ''} } from '@angular/core';
${(_11 = [...new Set([...(_p = innerComponents === null || innerComponents === void 0 ? void 0 : innerComponents.map(comp => `import { ${getComponentName(comp.name)} } from './${comp.dirPath}';`)) !== null && _p !== void 0 ? _p : [],
            ...(_r = (_q = innerServices === null || innerServices === void 0 ? void 0 : innerServices.filter(service => !(service === null || service === void 0 ? void 0 : service.providedInRoot))) === null || _q === void 0 ? void 0 : _q.map(serv => `import { ${getServiceName(serv.name)} } from './${serv.dirPath}';`)) !== null && _r !== void 0 ? _r : [],
            ...(_t = (_s = innerPipes === null || innerPipes === void 0 ? void 0 : innerPipes.filter(pipe => pipe === null || pipe === void 0 ? void 0 : pipe.standalone)) === null || _s === void 0 ? void 0 : _s.map(pipe => `import { ${getPipeName(pipe.name)} } from './${pipe.dirPath}';`)) !== null && _t !== void 0 ? _t : [],
            ...(_v = (_u = innerDirectives === null || innerDirectives === void 0 ? void 0 : innerDirectives.filter(directive => directive === null || directive === void 0 ? void 0 : directive.standalone)) === null || _u === void 0 ? void 0 : _u.map(directive => `import { ${getDirectiveName(directive.name)} } from './${directive.dirPath}';`)) !== null && _v !== void 0 ? _v : [],
            ...(_y = (_x = (_w = component.inputs) === null || _w === void 0 ? void 0 : _w.filter(input => input === null || input === void 0 ? void 0 : input.importTypeUrl)) === null || _x === void 0 ? void 0 : _x.map(input => `import { ${input.type} } from '${input.importTypeUrl}';`)) !== null && _y !== void 0 ? _y : [],
            ...(_1 = (_0 = (_z = component.outputs) === null || _z === void 0 ? void 0 : _z.filter(output => output === null || output === void 0 ? void 0 : output.importTypeUrl)) === null || _0 === void 0 ? void 0 : _0.map(output => `import { ${output.type} } from '${output.importTypeUrl}';`)) !== null && _1 !== void 0 ? _1 : [],
            ...(_4 = (_3 = (_2 = component.models) === null || _2 === void 0 ? void 0 : _2.filter(model => model === null || model === void 0 ? void 0 : model.importTypeUrl)) === null || _3 === void 0 ? void 0 : _3.map(model => `import { ${model.type} } from '${model.importTypeUrl}';`)) !== null && _4 !== void 0 ? _4 : [],
            ...(_6 = (_5 = innerInputs === null || innerInputs === void 0 ? void 0 : innerInputs.filter(input => input === null || input === void 0 ? void 0 : input.importTypeUrl)) === null || _5 === void 0 ? void 0 : _5.map(input => `import { ${input.type} } from '${input.importTypeUrl}';`)) !== null && _6 !== void 0 ? _6 : [],
            ...(_8 = (_7 = innerOutputs === null || innerOutputs === void 0 ? void 0 : innerOutputs.filter(output => output === null || output === void 0 ? void 0 : output.importTypeUrl)) === null || _7 === void 0 ? void 0 : _7.map(output => `import { ${output.type} } from '${output.importTypeUrl}';`)) !== null && _8 !== void 0 ? _8 : [],
            ...(_10 = (_9 = innerModels === null || innerModels === void 0 ? void 0 : innerModels.filter(model => model === null || model === void 0 ? void 0 : model.importTypeUrl)) === null || _9 === void 0 ? void 0 : _9.map(model => `import { ${model.type} } from '${model.importTypeUrl}';`)) !== null && _10 !== void 0 ? _10 : []
        ])]) === null || _11 === void 0 ? void 0 : _11.join('\n')}

@Component({
    standalone: ${component.standalone},
    selector: '${component.selector}',
    templateUrl: './${component.templateUrl}',
    styleUrls: [${(_13 = (_12 = component.styleUrls) === null || _12 === void 0 ? void 0 : _12.map(url => `'./${url}'`)) === null || _13 === void 0 ? void 0 : _13.join(',')}],
    providers: ${(innerServices === null || innerServices === void 0 ? void 0 : innerServices.length) ? `[
        ${(_15 = (_14 = innerServices === null || innerServices === void 0 ? void 0 : innerServices.filter(service => !(service === null || service === void 0 ? void 0 : service.providedInRoot))) === null || _14 === void 0 ? void 0 : _14.map(service => `${getServiceName(service.name)}`)) === null || _15 === void 0 ? void 0 : _15.join(',\n\t\t')}
    ]` : '[]'},
    imports: ${(innerComponents === null || innerComponents === void 0 ? void 0 : innerComponents.length) || (innerPipes === null || innerPipes === void 0 ? void 0 : innerPipes.length) || (innerDirectives === null || innerDirectives === void 0 ? void 0 : innerDirectives.length) ? `[
        ${(_21 = [
        ...(_16 = innerComponents === null || innerComponents === void 0 ? void 0 : innerComponents.map(comp => `${getComponentName(comp.name)},`)) !== null && _16 !== void 0 ? _16 : [],
        ...(_18 = (_17 = innerPipes === null || innerPipes === void 0 ? void 0 : innerPipes.filter(pipe => pipe === null || pipe === void 0 ? void 0 : pipe.standalone)) === null || _17 === void 0 ? void 0 : _17.map(pipe => `${getPipeName(pipe.name)},`)) !== null && _18 !== void 0 ? _18 : [],
        ...(_20 = (_19 = innerDirectives === null || innerDirectives === void 0 ? void 0 : innerDirectives.filter(directive => directive === null || directive === void 0 ? void 0 : directive.standalone)) === null || _19 === void 0 ? void 0 : _19.map(directive => `${getDirectiveName(directive.name)},`)) !== null && _20 !== void 0 ? _20 : []
    ]) === null || _21 === void 0 ? void 0 : _21.join('\n\t\t')}
    ]` : '[]'},
})
${component.defaultExport ? 'export default' : 'export'} class ${getComponentName(component.name)} {
    ${[
        ...(_22 = innerInputs === null || innerInputs === void 0 ? void 0 : innerInputs.map(innerInput => `${innerInput.name}${(innerInput.initialValue != null || innerInput.initialValue != undefined) ? ` = ${JSON.stringify(innerInput.initialValue)}` : `!: ${innerInput.type}`};`)) !== null && _22 !== void 0 ? _22 : [],
        ...(_23 = innerModels === null || innerModels === void 0 ? void 0 : innerModels.map(innerModel => `${innerModel.name} = signal<${innerModel.type}>(${(innerModel.initialValue != null || innerModel.initialValue != undefined) ? JSON.stringify(innerModel.initialValue) : ''});`)) !== null && _23 !== void 0 ? _23 : [],
        ...(_25 = (_24 = component.inputs) === null || _24 === void 0 ? void 0 : _24.map(input => `${input.name} = input${input.required ? '.required' : ''}<${input.type}>(${(input.initialValue != null || input.initialValue != undefined) ? JSON.stringify(input.initialValue) : ''}${input.alias ? `, { alias: '${input.alias}' }` : ''});`)) !== null && _25 !== void 0 ? _25 : [],
        ...(_27 = (_26 = component.outputs) === null || _26 === void 0 ? void 0 : _26.map(output => `${output.name} = output<${output.type}>();`)) !== null && _27 !== void 0 ? _27 : [],
        ...(_29 = (_28 = component.models) === null || _28 === void 0 ? void 0 : _28.map(model => `${model.name} = model${model.required ? '.required' : ''}<${model.type}>(${(model.initialValue != null || model.initialValue != undefined) ? JSON.stringify(model.initialValue) : ''}${model.alias ? `, { alias: '${model.alias}' }` : ''});`)) !== null && _29 !== void 0 ? _29 : []
    ].reduce((acc, curr) => acc += curr + '\n\t', '')}\n\tconstructor() { }${innerOutputs.length ? '\n' : ''}
    ${[
        ...(_30 = innerOutputs === null || innerOutputs === void 0 ? void 0 : innerOutputs.map(innerOutput => { var _a; return `${innerOutput.name}Change(event: ${(_a = innerOutput.type) !== null && _a !== void 0 ? _a : 'any'}) { throw Error('Implement method') }`; })) !== null && _30 !== void 0 ? _30 : []
    ].join('\n\t')}
}`;
    const templateContent = `
<p>${component.selector} works!</p> ${component.components ? `\n\n${(_31 = component.components) === null || _31 === void 0 ? void 0 : _31.map(comp => {
        var _a, _b, _c, _d, _e, _f;
        return `<${comp.selector} ${[
            ...(_b = (_a = comp.inputs) === null || _a === void 0 ? void 0 : _a.map(input => { var _a; return `[${(_a = input.alias) !== null && _a !== void 0 ? _a : input.name}]="${input.name}"`; })) !== null && _b !== void 0 ? _b : [],
            ...(_d = (_c = comp.outputs) === null || _c === void 0 ? void 0 : _c.map(output => { var _a; return `(${(_a = output.alias) !== null && _a !== void 0 ? _a : output.name})="${output.name}Change($event)"`; })) !== null && _d !== void 0 ? _d : [],
            ...(_f = (_e = comp.models) === null || _e === void 0 ? void 0 : _e.map(model => { var _a; return `[(${(_a = model.alias) !== null && _a !== void 0 ? _a : model.name})]="${model.name}"`; })) !== null && _f !== void 0 ? _f : [],
        ].join('\n\t')}></${comp.selector}>`;
    }).join('\n')}` : ''}
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
    constructor() { }
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